/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';

import codePush from 'react-native-code-push'

type Props = {};
export default class App extends Component<Props> {
  componentDidMount() {
    this.checkCodePushVersion()
  }
  //code push热修复接入口
  checkCodePushVersion() {
    codePush.sync({
          updateDialog: {
            appendReleaseDescription: true,          //true表示显示更新信息，如果为false就不会提示用户直接下载
            descriptionPrefix: '\n更新内容：\n',
            title: '有新的更新包',
            mandatoryUpdateMessage: '',
            mandatoryContinueButtonLabel: '更新',
          },
          mandatoryInstallMode: codePush.InstallMode.ON_NEXT_RESTART,     //更新模式
          deploymentKey: '9037GPrqx0XMdFpze5YHm-WU1bHw8a819c0d-0e67-4356-a30e-a58b089a63bf',     //你自己配置的key，打包时使用到的DEPLOYMENTKEY
        },
        this.codePushStatusDidChange.bind(this),  //状态监听
        this.codePushDownloadDidProgress.bind(this));   //下载进度监听
  }
  //code-push的状态监听
  codePushStatusDidChange(status) {
    switch (status) {
      case codePush.SyncStatus.CHECKING_FOR_UPDATE:
        console.log("Checking for updates.");
        break;
      case codePush.SyncStatus.DOWNLOADING_PACKAGE:
        console.log("Downloading package.");
        break;
      case codePush.SyncStatus.INSTALLING_UPDATE:
        ToastAndroid.showWithGravity("下载完成，下次进入将会自动更新", ToastAndroid.SHORT, ToastAndroid.CENTER)
        break;
      case codePush.SyncStatus.UP_TO_DATE:
        console.log("Installing update.");
        break;
      case codePush.SyncStatus.UPDATE_INSTALLED:
        console.log("Update installed.");
        break;
    }
  }

  //code-push的下载进度监听
  codePushDownloadDidProgress(progress) {
    console.log(progress.receivedBytes + " of " + progress.totalBytes + " received.");
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Yahoooooooooooooooooooooo</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
