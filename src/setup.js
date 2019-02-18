/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {StyleSheet, Text} from 'react-native';

import codePush from './config/codePush'

import DrawerNavigator from './config/AppRouter'

type Props = {};
export default class App extends Component<Props> {
    componentDidMount() {
        codePush.checkCodePushVersion()
    }

    render() {
        return (
            <DrawerNavigator/>
        );
    }
}

const styles = StyleSheet.create({

});
