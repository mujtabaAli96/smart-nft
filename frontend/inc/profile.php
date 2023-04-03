<?php
class SmartNftProfile 
{
	
	function __construct() {
		register_activation_hook( PLUGIN_ROOT . "smart-nft.php",array( $this,"create_profile_page" ) );
	}

	public function create_profile_page () {
		$page_id = get_option( 'smartnft_profile_page_id' );
		if( !$page_id ) {
			$nft_page_id = wp_insert_post(
				[
					"post_title" 		=> esc_html__("Profile", WP_SMART_NFT),
					"post_content"  => '[ProfilePage]',
					"post_name"	  	=> "profile",
					"post_type"     => "page",
					"post_status"   => "publish"
					]
				);
				add_option('smartnft_profile_page_id', $nft_page_id );
			}
			elseif( !get_post_status( $page_id ) ){
			$nft_page_id = wp_insert_post(
				[
					"post_title" 		=> esc_html__("Profile", WP_SMART_NFT),
					"post_content"  => '[ProfilePage]',
					"post_name"	  	=> "profile",
					"post_type"     => "page",
					"post_status"   => "publish"
				]
			);
			update_option('smartnft_profile_page_id', $nft_page_id );
		}
	}

}

new SmartNftProfile();
