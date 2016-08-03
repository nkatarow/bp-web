<?php

/**
 * General Configuration
 *
 * All of your system's general configuration settings go in here.
 * View the default settings here craft/app/etc/config/defaults/general.php
 */

// Ensure our urls have the right scheme
define('URI_SCHEME',  ( isset($_SERVER['HTTPS'] ) ) ? "https://" : "http://" );

// The site url
define('SITE_URL',    URI_SCHEME . $_SERVER['SERVER_NAME'] . '/');

// The site basepath
define('BASEPATH', 	  realpath(CRAFT_BASE_PATH . '/../') . '/');

$customConfig = array(
	'*' => array(
		'allowAutoUpdates' => true,
		'backupDbOnUpdate' => true,
		'restoreDbOnUpdateFailure' => true,
		'cpTrigger' => 'manage',
		'omitScriptNameInUrls' => true,
	),

	'dev' => array(
		'devMode' => true,
        'environmentVariables' => array(
            'basePath' => '/users/nick/sites/bridge-partners/public/',
            'baseUrl'  => 'http://bridge.dev/',
            'siteUrl'  => 'http://bridge.dev/',
        )
	),

	'stage' => array(
        'devMode' => true,
		'maxInvalidLogins' => 3,
        'environmentVariables' => array(
            'basePath' => '/ethkal1/staging.bridgepartnersconsulting.com/public/',
            'baseUrl'  => 'http://staging.bridgepartnersconsulting.com/',
            'siteUrl'  => 'http://staging.bridgepartnersconsulting.com',
        )
	),

	'prod' => array(
        'devMode' => false,
		'maxInvalidLogins' => 3,
        'environmentVariables' => array(
            'basePath' => '/ethkal1/bridgepartnersconsulting.com/public/',
            'baseUrl'  => 'http://bridgepartnersconsulting.com/',
            'siteUrl'  => 'http://bridgepartnersconsulting.com',
        )
	)
);

// If a local config file exists, merge any local config settings
if (is_array($customLocalConfig = @include(CRAFT_CONFIG_PATH . 'local/general.php')))
{
  $customGlobalConfig = array_merge($customConfig['*'], $customLocalConfig);
  $customConfig['*'] = $customGlobalConfig;
}

return $customConfig;
