<?php

class Smartnft_FilterNfts
{
    function __construct(){
        add_action('wp_ajax_filter_nfts', [ $this, 'smartnft_filter_nfts' ], 10 );
        add_action('wp_ajax_nopriv_filter_nfts', [ $this, 'smartnft_filter_nfts' ], 10 );
    }

    public function smartnft_filter_nfts(){
        $offset 	     = sanitize_text_field($_POST["offset"]);	
        $limit  	     = sanitize_text_field($_POST["limit"]);	
        $status        = sanitize_text_field($_POST['status']);
        $price_order   = sanitize_text_field($_POST['priceOrder']);
        $search        = sanitize_text_field($_POST['search']);
        $chainId       = $_POST['chainId'];
        $price_range   = map_deep($_POST['priceRange'], 'sanitize_text_field');
        
        try{
          //get owned user  nfts from database	
          $meta_query = array();

            if( !empty( $price_range ) ){
                $meta_query[] = array(
                  'key'       =>  'priceInWei',
                  'value'     =>   $price_range, 
                  'type'		=>  'UNSIGNED',
                  'compare'   =>  'BETWEEN'
                );
            }

            if( !empty( $status ) ){
                $meta_query[] = array(
                    'key'       => 'isListed',
                    'value'     => $status,
                    'compare'   => '='
                );
            }

            if( !empty( $chainId ) ){
                $meta_query[] = array(
                    'key'       => 'chainId',
                    'value'     => $chainId,
                    'compare'   => '='
                );
            }

            $args = array (
              'post_type'      => 'smartnft',
              'post_status'    => 'publish',
              's'			   => $search,
              'posts_per_page' => intval( $limit ),
              'offset' 		   => intval( $offset ),
              'fields' 		   => 'ids',
              'meta_query'	   => $meta_query	
            );

            if( !empty( $price_order ) ) {
              switch( $price_order ) {
              case 'priceasc' :
                  $args['meta_key']   = 'price';
                  $args['orderby']    = 'meta_value_num';
                  $args['order']      = 'ASC';
                  break;
              case 'pricedesc' :
                  $args['meta_key']   = 'price';
                  $args['orderby']    = 'meta_value_num';
                  $args['order']      = 'DESC';
                  break;
              default:
              }
            }

			$tax_query = array();

            if( isset( $_POST["collectionId"] ) && !empty( $_POST["collectionId"] ) ) {
              $tax_query[] = array(
                  'taxonomy'=> 'smartnft_collection',
                  'field'	=> 'term_id',
                  'terms'	=> sanitize_text_field( $_POST["collectionId"]  )
                );
            }

            if( isset( $_POST["categoryId"] ) && !empty( $_POST["categoryId"] ) ) {
              $tax_query[] = array(
                  'taxonomy'=> 'smartnft_category',
                  'field'	=> 'term_id',
                  'terms'	=> sanitize_text_field( $_POST["categoryId"]  )
              );
            }

              $args["tax_query"] = $tax_query;

              $the_query = new WP_Query( $args );
			  //var_dump( $the_query->request );

              $all_nfts = array();

              $settings = get_option("smartnft_settings",[]);
              $quality = $settings['thumbQuality'] == '' ? 'medium' : $settings['thumbQuality'];
          
              if( $the_query->have_posts() ) {
                  while ( $the_query->have_posts() ) {
                      $the_query->the_post();
                      $post_meta = get_post_meta( get_the_ID(), 'smartnftData', false );
                      $post_permalink = get_the_permalink();
                      $thumbnail_id = $post_meta[0]['thumbnailMediaUrl']['attach_id'];
                      $thumbnail_url = wp_get_attachment_image_url( (int)$thumbnail_id, $quality);
                      $post_meta[0]['permalink'] = $post_permalink;
                      $post_meta[0]['thumbnailMediaUrl']['attach_url'] = $thumbnail_url;

                      array_push( $all_nfts, $post_meta[0] );
                  }
              }

              wp_send_json (
                [
                  "data"    => [
					"nfts" => $all_nfts, 
					"total_post_found" => $the_query->found_posts 
                  ]
                ],
                200
              );
        }catch (Exception $e) {
          wp_send_json(
            [
              "status" => esc_html__("fail", WP_SMART_NFT),
              "message" => $e->getMessage()
            ],
            400
          );
		    }
    }

}


new Smartnft_FilterNfts();
