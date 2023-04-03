<?php

class Smartnft_FilterCollections
{
    function __construct(){
        add_action('wp_ajax_filter_collections', [ $this, 'smartnft_filter_collections' ], 10 );
        add_action('wp_ajax_nopriv_filter_collections', [ $this, 'smartnft_filter_collections' ], 10 );

        // Tools : Update collection meta data
        add_action('wp_ajax_update_collection_tools', [ $this, 'smartnft_update_collection_tools' ], 10 );
        add_action('wp_ajax_update_singlenft_tools', [ $this, 'smartnft_update_singlenft_tools' ], 10 );
    }

    public function smartnft_update_singlenft_tools(){
        if( !isset( $_POST['contract_addr'] ) || empty($_POST['contract_addr']) ){
            wp_send_json( [
                'message' => esc_html__( "Contarct Address cannot be empty", WP_SMART_NFT )
            ], 400 );
        }

		$contract_addr = sanitize_text_field( $_POST["contract_addr"] );	

        try{
            $args = [
				'post_type'      => 'smartnft',
				'post_status'    => 'publish',
				'fields' 	     => 'ids',
				'meta_query' => array(
                    array(
                        'key'     => 'contract_addr',
                        'value'   => strtolower($contract_addr),
                        'compare' => '='
                    ),
                )
			];

            $nft_ids = get_posts( $args );

            $all_ids = [];

            if( !empty($nft_ids) ){
                foreach( $nft_ids as $nft_id){
                    $child_args = array(
                        'post_parent' => $nft_id,
                        'post_type'   => 'token_tx',
                        'post_status' => 'private',
                    );
                    if( empty( get_children( $child_args ) ) ){
                        // Adding Tx history data
                        $meta = get_post_meta($nft_id,"smartnft_meta",false)[0];
                        $tx_history_mint = wp_insert_post(
                            array(
                                'post_title' 	=> $meta['name'],
                                'post_type'		=> 'token_tx',
                                'post_status'	=> 'private',
                                'post_parent'	=> $nft_id,
                                'meta_input'	=> array(
                                    'media_url'   		=> $meta['mediaUrl'],
                                    'type'				=> 'mint',
                                    'from'				=> '',
                                    'to'				=> strtolower( $meta["creator"] ),
                                    'price'				=> '',
                                    'qty'				=> 1,
                                    'txHash'			=> $meta['txHash']
                                ),
                                'tax_input'		=> array(
                                    'smartnft_collection' => $meta["collection"] 
                                )		
                            )
                        );
                        $tx_history_list = wp_insert_post(
                            array(
                                'post_title' 	=> $meta['name'],
                                'post_type'		=> 'token_tx',
                                'post_status'	=> 'private',
                                'post_parent'	=> $nft_id,
                                'meta_input'	=> array(
                                    'media_url'   		=> $meta['mediaUrl'],
                                    'type'				=> 'list',
                                    'from'				=> '',
                                    'to'				=> strtolower( $meta["creator"] ),
                                    'price'				=> intval( $meta["price"] ),
                                    'qty'				=> 1,
                                    'txHash'			=> $meta['txHash']
                                ),
                                'tax_input'		=> array(
                                    'smartnft_collection' => $meta["collection"] 
                                )
                            )
                        );
                    }
                }
            }
            wp_send_json( esc_html__("Success", WP_SMART_NFT), 200 );
        }catch( Exception $e ){
            wp_send_json(
                [
                    "message" => $e->getMessage()
                ],
                400
            );
        }
    }
    public function smartnft_update_collection_tools(){
        if( !isset( $_POST['contract_addr'] ) || empty($_POST['contract_addr']) ){
            wp_send_json( [
                'message' => esc_html__( "Contarct Address cannot be empty", WP_SMART_NFT )
            ], 400 );
        }
        try{
            $contract_addr = sanitize_text_field( $_POST['contract_addr'] );
            $args = array(
                'taxonomy' => 'smartnft_collection',
                'hide_empty' => false,
                'fields'	=> 'ids'
            );
            if( !empty($contract_addr) ){
                $args['meta_query'][] = array(
                    'key'     => 'contract_add',
                    'value'   => $contract_addr,
                    'compare' => '=',
                );    
            }
            $terms = get_terms( $args );
            foreach( $terms as $term_id ){
                $nft_ids = get_posts(array(
                    'post_type'   => 'smartnft',
                    'post_status' => 'publish',
                    'numberposts' => -1,
                    'fields'    => 'ids',
                    'meta_query' => array(
                        array(
                            'key'   => 'contract_addr',
                            'value' => $contract_addr,
                            'compare' => '='
                        )
                    ),
                    'tax_query' => array(
                        array(
                            'taxonomy' => 'smartnft_collection',
                            'field' => 'term_id', 
                            'terms' => $term_id,
                            'include_children' => false
                        )
                    )
                ));
                $prices = [];
                if( !empty( $nft_ids ) ){
                    foreach( $nft_ids as $nft_id ){
                        $nft_price = get_post_meta($nft_id, 'price', true );
                        array_push( $prices, $nft_price );
                    }
                }

                $total_volume = empty( $prices ) ? 0 : strval( array_sum( $prices ) );
                $floor_price = empty( $prices ) ? 0 : min($prices);

                // Update total vol
                // if( !metadata_exists( 'term', $term_id, 'total_volume' ) )
                update_term_meta( $term_id, 'total_volume', $total_volume );
                
                // Update floor price
                // if( !metadata_exists( 'term', $term_id, 'floor_price' ) )
                update_term_meta( $term_id, 'floor_price', $floor_price );
                    
                // Update 24h total vol
                if( !metadata_exists( 'term', $term_id, 'total_vol_24h' ) )
                    update_term_meta( $term_id, 'total_vol_24h', 0 );
                    
                // Update 24h total vol
                if( !metadata_exists( 'term', $term_id, 'total_vol_24h_prev' ) )
                    update_term_meta( $term_id, 'total_vol_24h_prev', 0 );
                
                // Update 5m total vol prev
                if( !metadata_exists( 'term', $term_id, 'total_vol_5m_prev' ) )
                    update_term_meta( $term_id, 'total_vol_5m_prev', 0 );
                
                // Update 5m total vol
                if( !metadata_exists( 'term', $term_id, 'total_vol_5m' ) )
                    update_term_meta( $term_id, 'total_vol_5m', 0 );
                
                // Update 15m total vol prev
                if( !metadata_exists( 'term', $term_id, 'total_vol_15m_prev' ) )
                    update_term_meta( $term_id, 'total_vol_15m_prev', 0 );
                
                // Update 15m total vol
                if( !metadata_exists( 'term', $term_id, 'total_vol_15m' ) )
                    update_term_meta( $term_id, 'total_vol_15m', 0 );
                
                // Update 30m total vol prev
                if( !metadata_exists( 'term', $term_id, 'total_vol_30m_prev' ) )
                    update_term_meta( $term_id, 'total_vol_30m_prev', 0 );
                
                // Update 30m total vol
                if( !metadata_exists( 'term', $term_id, 'total_vol_30m' ) )
                    update_term_meta( $term_id, 'total_vol_30m', 0 );
                
                // Update 1h total vol prev
                if( !metadata_exists( 'term', $term_id, 'total_vol_1h_prev' ) )
                    update_term_meta( $term_id, 'total_vol_1h_prev', 0 );
                
                // Update 1h total vol
                if( !metadata_exists( 'term', $term_id, 'total_vol_1h' ) )
                    update_term_meta( $term_id, 'total_vol_1h', 0 );
                
                // Update 6h total vol prev
                if( !metadata_exists( 'term', $term_id, 'total_vol_6h_prev' ) )
                    update_term_meta( $term_id, 'total_vol_6h_prev', 0 );
                
                // Update 6h total vol
                if( !metadata_exists( 'term', $term_id, 'total_vol_6h' ) )
                    update_term_meta( $term_id, 'total_vol_6h', 0 );
                
                
                // Update 24h total vol prev
                if( !metadata_exists( 'term', $term_id, 'total_vol_24h_prev' ) )
                    update_term_meta( $term_id, 'total_vol_24h_prev', 0 );
                
                // Update 24h total vol
                if( !metadata_exists( 'term', $term_id, 'total_vol_24h' ) )
                    update_term_meta( $term_id, 'total_vol_24h', 0 );
                
                
                // Update 3d total vol prev
                if( !metadata_exists( 'term', $term_id, 'total_vol_3d_prev' ) )
                    update_term_meta( $term_id, 'total_vol_3d_prev', 0 );
                
                // Update 3d total vol
                if( !metadata_exists( 'term', $term_id, 'total_vol_3d' ) )
                    update_term_meta( $term_id, 'total_vol_3d', 0 );
                
                
                // Update 7d total vol prev
                if( !metadata_exists( 'term', $term_id, 'total_vol_7d_prev' ) )
                    update_term_meta( $term_id, 'total_vol_7d_prev', 0 );
                
                // Update 7d total vol
                if( !metadata_exists( 'term', $term_id, 'total_vol_7d' ) )
                    update_term_meta( $term_id, 'total_vol_7d', 0 );
                
                // Update 30d total vol prev
                if( !metadata_exists( 'term', $term_id, 'total_vol_30d_prev' ) )
                    update_term_meta( $term_id, 'total_vol_30d_prev', 0 );
                
                // Update 30d total vol
                if( !metadata_exists( 'term', $term_id, 'total_vol_30d' ) )
                    update_term_meta( $term_id, 'total_vol_30d', 0 );
                
            }
        }catch( Exception $e ){
            wp_send_json(
                [
                    "message" => $e->getMessage()
                ],
                400
            );
        }
    }
    public function smartnft_filter_collections(){
        $offset 	    = sanitize_text_field($_POST["offset"]);	
        $limit  		= sanitize_text_field($_POST["limit"]);	
        $contract_addr  = sanitize_text_field($_POST["contract_addr"]);	

        $time_frame = sanitize_text_field( isset($_POST['timeframe']) );
        try{
            $args = array (
                'taxonomy'      => 'smartnft_collection',
                'number'        => intval( $limit ),
                'offset' 		=> intval( $offset ),
                'hide_empty'    => false,
                'meta_query' 	=> array(),
            );
            if( $time_frame ){
                $args = array_merge( $args, array(
                    'orderby'       => 'meta_value_num',
                    'meta_key'      => 'total_vol_' . $time_frame,
                    'order'         => 'DESC'
                ));
            }

            if( !empty($contract_addr) ){
                $args['meta_query'][] = array(
                        'key'     => 'contract_add',
                        'value'   => $contract_addr,
                        'compare' => '=',
                );
            }

            if( isset( $_POST["accAdd"] ) && !empty( $_POST["accAdd"] ) ) {
                $acc_add        = sanitize_text_field(($_POST["accAdd"]));

                $args['meta_query'][] = array(
                        'key'     => 'creator',
                        'value'   => strtolower( $acc_add ),
                        'compare' => '=',
                );
            }

            $terms = get_terms( $args );
            $response = [];
            
            foreach( $terms as $term ){
                $term_id = $term->term_id;
                

                // Collection Data
                $profile_img = get_term_meta( $term_id, 'profile_image', false );
                $cover_img = get_term_meta( $term_id, 'cover_image', false );
                $creator = get_term_meta( $term_id, 'creator', true );

                // Getting owneres
                $nft_ids = get_posts(array(
                    'post_type'   => 'smartnft',
                    'post_status' => 'publish',
                    'numberposts' => -1,
                    'fields'    => 'ids',
                    'meta_query' => array(
                        array(
                            'key'   => 'contract_addr',
                            'value' => $contract_addr,
                            'compare' => '='
                        )
                    ),
                    'tax_query' => array(
                        array(
                            'taxonomy' => 'smartnft_collection',
                            'field' => 'term_id', 
                            'terms' => $term_id,
                            'include_children' => false
                        )
                    )
                ));

                // Items listed
                $listed_nfts = get_posts(array(
                    'post_type'   => 'smartnft',
                    'post_status' => 'publish',
                    'numberposts' => -1,
                    'fields'    => 'ids',
                    'meta_query' => array(
                        array(
                            'key'   => 'contract_addr',
                            'value' => $contract_addr,
                            'compare' => '='
                        ),
                        array(
                            'key'   => 'isListed',
                            'value' => true,
                            'compare' => '='
                        )
                    ),
                    'tax_query' => array(
                        array(
                            'taxonomy' => 'smartnft_collection',
                            'field' => 'term_id', 
                            'terms' => $term_id,
                            'include_children' => false
                        )
                    )
                ));
                $owners = [];
                if( !empty( $nft_ids ) ){
                    foreach( $nft_ids as $nft_id ){
                        $owner = get_post_meta($nft_id, 'owner', true );
                        array_push( $owners, $owner );
                    }
                }
                $total_owners = !empty($owners) ? array_unique($owners) : [];

                if( $time_frame ){
                    $current_vol = metadata_exists( 'term', $term_id, 'total_vol_' . $time_frame ) ? 
                    get_term_meta( $term_id, 'total_vol_' . $time_frame, true ) : 0;
                    
                    $prev_vol = metadata_exists( 'term', $term_id, 'total_vol_'. $time_frame .'_prev' ) ? 
                    get_term_meta( $term_id, 'total_vol_'. $time_frame .'_prev', true ) : 0;
                    $percent_changes = $this->pct_change( $prev_vol, $current_vol );
                }
            
                $total_volume = get_term_meta( $term_id, 'total_volume', true );
                $total_volume = $total_volume ? $total_volume : 0;

                $floor_price = get_term_meta( $term_id, 'floor_price', true );
                $floor_price = $floor_price ? $floor_price : 0;

                $response[] = array(
                    'total_vol'        => $total_volume,
                    'floor_price'      => $floor_price,
                    'owners'           => !empty($total_owners) ? count($total_owners) : 0,
                    'creator'          => $creator,
                    'name'             => $term->name,
                    'permalink'        => get_term_link($term_id),
                    'collectionImg'    => $profile_img,
                    'collectionBanner' => $cover_img,
                    'contract'         => $contract_addr,
                    'count'            => $term->count,
                    // 'listed_nfts'      => !empty($listed_nfts) ? count( $listed_nfts ) : 0,
                    // 'listed_percent'   => $this->calculated_list_pct( $listed, $total ),
                    // 'vol'              => $current_vol,
                    // 'changes'          => $percent_changes                       
                );
            }


            wp_send_json (
            [
                "data"    => [
                    "collections"   => $response, 
                    // will deprecated in v1.5.0
                     "total_collections" => !empty( $total_collections ) ? count( $total_collections ) : 0
                ]
            ],
            200
            );
        }catch (Exception $e) {
            wp_send_json(
                [
                    "message" => $e->getMessage()
                ],
                400
            );
        }
    }
    public function pct_change($old, $new, int $precision = 2): float
    {
        $new = $new != 0 ? intval($new) / 1000000000000000000 : 0;
        if ($old == 0) {
            $old++;
            $new++;
        }

        $change = (($new - $old) / $old) * 100;

        return round($change, $precision);
    }
    function calculated_list_pct( $listed, $total ){
        if( !$listed == 0 && !$total == 0 ){
            $res = ($listed/$total) * 100;
        }else{
            $res = 0;
        }
        return is_float($res) ? round( $res, 2 ) : $res;
    }

}


new Smartnft_FilterCollections();
