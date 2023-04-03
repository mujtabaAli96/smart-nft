<?php

class SmartNFT_Theme_Header{
    function __construct(){
        add_filter( 'smartchain_header_elements_list', array( $this, 'add_wallet_connect_btn' ), 10, 1 );
        add_action( 'smartchain_wallet_connect', array( $this, 'smartchain_wallet_connect' ) );
    }
    function smartchain_wallet_connect(){
        echo '<button>Connect wallet</button>';
    }
    function add_wallet_connect_btn( $elements ){
        $args = array(
            'wallet-connect' => esc_html__( 'Connect Wallet', WP_SMART_NFT ),
        );
        return array_merge( $elements, $args );
    }
}
new SmartNFT_Theme_Header();