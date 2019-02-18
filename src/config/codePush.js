import React from 'react';
import {ToastAndroid} from "react-native";
import codePush from 'react-native-code-push'

export default class codePushConfig {
    static checkCodePushVersion() {
        codePush.sync({
                updateDialog: {
                    //是否显示更新描述
                    appendReleaseDescription: true,
                    //更新描述的前缀。 默认为"Description"
                    descriptionPrefix: '\n更新内容：\n',
                    //Alert窗口的标题
                    title: '有新的更新包',
                    //强制更新时，检查到更新的消息文本
                    mandatoryUpdateMessage: '有新的贼啦酷炫的更新，不更新就别用',
                    //强制更新按钮文字，默认为continue
                    mandatoryContinueButtonLabel: '更新',
                    //非强制更新时，按钮文字,默认为"ignore"
                    optionalIgnoreButtonLabel : '稍后',
                    //非强制更新时，确认按钮文字. 默认为"Install"
                    optionalInstallButtonLabel : '后台更新',
                    //非强制更新时，检查到更新的消息文本
                    optionalUpdateMessage : '有新的贼啦酷炫的更新' ,
                },
                mandatoryInstallMode: codePush.InstallMode.ON_NEXT_RESTART,     //更新模式
                deploymentKey: '9037GPrqx0XMdFpze5YHm-WU1bHw8a819c0d-0e67-4356-a30e-a58b089a63bf',     //你自己配置的key，打包时使用到的DEPLOYMENTKEY
        },
        this.codePushStatusDidChange(this),  //状态监听
        this.codePushDownloadDidProgress(this));   //下载进度监听
    }
    //code-push的状态监听
    static codePushStatusDidChange(status) {
        switch (status) {
            case codePush.SyncStatus.CHECKING_FOR_UPDATE:  // 检测更新
                console.log("Checking for updates.");
                break;
            case codePush.SyncStatus.DOWNLOADING_PACKAGE:  // 安装更新
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
    static codePushDownloadDidProgress(progress) {
        console.log(progress.receivedBytes + " of " + progress.totalBytes + " received.");
    }
}