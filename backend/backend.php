<?php

class MergeBackend 
{
	
	function __construct() {
		$this->include_backend_files();
	}

	public function include_backend_files () {
		include "api/storeNft.php";
		include "api/contract-address.php";
		include "api/store-txhash.php";
		include "api/store-likes.php";
		include "api/settings.php";
		include "api/top-collector.php";
		include "api/category.php";
		include "api/erc1155-owners.php";
		include "api/auction.php";
		// NFT filters
		include "api/filter-nfts.php";
		// Collections filter
		include "api/collection.php";
		// Loading widgest [elementor and others]
		include "inc/widgets.php";
		// Load Shortcodes
		include "inc/shortcode.php";
		// register post type
		include "inc/custom-post.php";
		//update db and other stauf
		//include "inc/update/update.php";
	}
}

new MergeBackend();
