/**
 * @format
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import {AppRegistry} from 'react-native';
import setup from './src/setup'
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => setup);
