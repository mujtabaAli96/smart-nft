<?php

class Verify_SmartNFT{
    function __construct(){
        add_action( "wp_ajax_verify_product",array( $this,"smartnft_verify_product" ), 10 );
		add_action( "wp_ajax_nopriv_verify_product",array( $this,"smartnft_verify_product" ), 10 );
    }

    public function smartnft_verify_product(){
        //check if key is send or not
        $licencekey = get_option( 'snft_activation_key', false );
        if( $licencekey )
            $_POST['licencekey'] = $licencekey;
		if( !isset( $_POST[ "licencekey" ] ) || empty( $_POST[ "licencekey" ] ) ) {
			wp_send_json(
				[
					"verified" => false,
					"message" => esc_html__("Please send valid licence key", WP_SMART_NFT),
				],
				200
			);
		}

        try{
            $token = "wOyA2HldNulaXQ5ZtBc0OfRIJBezRvQT";
            $licencekey = sanitize_text_field($_POST['licencekey']); 
            $url = "https://api.envato.com/v3/market/author/sale?code=" . $licencekey;

            $args = array(
                'headers' => array(
                    'Content-Type' => 'application/json',
                    'Authorization' => 'Bearer ' . $token, 
                    'User-Agent' => esc_html__('Purchase code verification', WP_SMART_NFT)
                )
            ); 

            $response = wp_remote_get( $url, $args );
            
            $res = [];
            $res['verified'] = $response['response']['code'] == 200 ? true : false;
            $res['key'] = $licencekey;
            
            if($response['response']['code'])
                update_option( 'snft_activation_key', $licencekey );

            wp_send_json( $res, 200 );
        }catch( Exception $e ) {
			wp_send_json(
				[
					"message" => $e->getMessage()
				],
				400
			);
		}

    }
}

new Verify_SmartNFT();
