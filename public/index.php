<?php

// Path to your craft/ folder
$craftPath = '../craft';

// Setup environment-friendly configs
switch ($_SERVER['SERVER_NAME']) {
	case 'bridge.dev' :
		define('CRAFT_ENVIRONMENT', 'dev');
		break;

	case 'staging.bridgepartnersconsulting.com' :
		define('CRAFT_ENVIRONMENT', 'stage');
		break;

	case 'bridgepartnersconsulting.com' :
		define('CRAFT_ENVIRONMENT', 'prod');
		break;

	default :
		define('CRAFT_ENVIRONMENT', 'prod');
		break;
}

// Do not edit below this line
$path = rtrim($craftPath, '/').'/app/index.php';

if (!is_file($path))
{
	exit('Could not find your craft/ folder. Please ensure that <strong><code>$craftPath</code></strong> is set correctly in '.__FILE__);
}

require_once $path;
