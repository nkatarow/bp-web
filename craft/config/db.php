<?php

/**
 * Database Configuration
 *
 * All of your system's database configuration settings go in here.
 * You can see a list of the default settings in craft/app/etc/config/defaults/db.php
 */

$customDbConfig = array(

	'*' => array(
		'tablePrefix' => 'homegrown_'
  	),

	'dev' => array(
		'server' => 'localhost',
		'database' => 'bridge',
		'user' => 'root',
		'password' => 'root',
		'environmentVariables' => array(
			'basePath' => '/Users/nick/Sites/bridge-partners/public/',
			'baseUrl' => 'http://bridge.dev/'
		)
  	),

	'stage' => array(
		'server' => 'localhost',
		'database' => 'bridge',
		'user' => 'eathomeg_newsite',
		'password' => 'Z5GLBrvB6d8U',
		'environmentVariables' => array(
			'basePath' => '?',
			'baseUrl' => 'http://staging.bridgepartnersconsulting.com/'
		)
  	),

	'prod' => array(
		'server' => 'localhost',
		'database' => 'bridge',
		'user' => 'eathomeg_newsite',
		'password' => 'Z5GLBrvB6d8U',
		'environmentVariables' => array(
			'basePath' => '?',
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
