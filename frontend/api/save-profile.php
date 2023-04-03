<?php

class SmartNftSaveProfile 
{
	function __construct() {
		add_action( "wp_ajax_nopriv_save_profile",array( $this,"smartnft_save_profile" ), 10 );
		add_action( "wp_ajax_save_profile",array( $this,"smartnft_save_profile" ), 10 );
	}

	function smartnft_save_profile () {

		//check req has data or not
		if( 
			!isset( $_POST[ "profile" ] ) || 
			empty( $_POST[ "profile" ] ) ||
			!isset( $_POST[ "account" ] ) || 
			empty( $_POST[ "account" ] )
	      )
		  {
		 	wp_send_json([ "status" => esc_html__("fail", WP_SMART_NFT) ], 400 );
		  }

		//check if account is send or not
		$accountHash = strtolower( sanitize_text_field($_POST[ "account" ]) );

		try {
			$accountHash = "profile_" . $accountHash;
			$profile = $_POST["profile"];

            if(!empty($profile['profileImg']) && !empty( $profile['profileMimeType'] ) ) {
                //fn define in backend/utils/utils.php
                $profile['profileImg'] = smartnft_upload_image_to_media_library( $profile['profileImg'], 'profile', $profile["profileMimeType"] ); 
            }

            if( !empty( $profile['bannerImg'] )  && !empty( $profile['bannerMimeType'] ) ) {
                //fn define in backend/utils/utils.php
                $profile['bannerImg'] = smartnft_upload_image_to_media_library( $profile['bannerImg'], 'banner', $profile["bannerMimeType"] ); 
            }
			
			//save or update the profile
			$res = update_option( $accountHash, $profile );

			wp_send_json( ["data" => $res ], 200 );
		} catch( Exception $e ) {
			wp_send_json([ "message" => $e->getMessage() ], 400 );
		}

	}

}

new SmartNftSaveProfile();
