/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {StyleSheet} from 'react-native';

import codePush from './config/codePush'

import {Provider} from 'react-redux'
import configStore from './redux/Store'

const store = configStore()

// import DrawerNavigator from './config/badRouter'
import DrawerNavigator from './config/AppRouter'

type Props = {};
export default class App extends Component<Props> {
    componentDidMount() {
        codePush.checkCodePushVersion()
    }

    render() {
        console.log(store)
        return (
            <Provider store={store}>
                <DrawerNavigator/>
            </Provider>
        );
    }
}

const styles = StyleSheet.create({

});
