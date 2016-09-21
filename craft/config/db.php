<?php

/**
 * Database Configuration
 *
 * All of your system's database configuration settings go in here.
 * You can see a list of the default settings in craft/app/etc/config/defaults/db.php
 */

$customDbConfig = array(

	'*' => array(
		'tablePrefix' => 'homeg_'
  	),

	'dev' => array(
		// 'server' => 'mysql.staging.bridgepartnersconsulting.com',
		// 'database' => 'bridgedbnew',
		// 'user' => 'bpone',
		// 'password' => 'bc?yJXM++3p*vRwa',
		'server' => 'localhost',
		'database' => 'bridgedbnew',
		'user' => 'root',
		'password' => 'root',
		'environmentVariables' => array(
			'basePath' => '/Users/nick/Sites/bridge-partners/public/',
			'baseUrl' => 'http://bridge.dev/'
		)
  	),

	'stage' => array(
		'server' => 'mysql.staging.bridgepartnersconsulting.com',
		'database' => 'bridgedbnew',
		'user' => 'bpone',
		'password' => 'bc?yJXM++3p*vRwa',
		'environmentVariables' => array(
			'basePath' => '/home/ethkal1/staging.bridgepartnersconsulting.com/public/',
			'baseUrl' => 'http://staging.bridgepartnersconsulting.com/'
		)
  	),

	'prod' => array(
		'server' => 'mysql.bridgepartnersconsulting.com',
		'database' => 'bridgedbnew',
		'user' => 'bpone',
		'password' => 'bc?yJXM++3p*vRwa',
		'environmentVariables' => array(
			'basePath' => '/home/ethkal1/bridgepartnersconsulting.com/public/',
			'baseUrl' => 'http://bridgepartnersconsulting.com/'
		)
	)
);

// If a local db file exists, merge the local db settings
if (is_array($customLocalDbConfig = @include(CRAFT_CONFIG_PATH . 'local/db.php')))
{
	$customGlobalDbConfig = array_merge($customDbConfig['*'], $customLocalDbConfig);
	$customDbConfig['*'] = $customGlobalDbConfig;
}

return $customDbConfig;
