package com.yahooweather;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.reactnativecommunity.webview.RNCWebViewPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.microsoft.codepush.react.CodePush;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

 import android.support.annotation.NonNull;


public class MainApplication extends Application implements ReactApplication {
  private final String CODEPUSH_KEY_PRODUCTIO = "9037GPrqx0XMdFpze5YHm-WU1bHw8a819c0d-0e67-4356-a30e-a58b089a63bf";
  private final String CODEPUSH_KEY_STAGING = "h_IBsnjh1JChgqzbabknzYkwT2JA8a819c0d-0e67-4356-a30e-a58b089a63bf";
  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

        @NonNull
        @Override
        protected String getJSBundleFile() {
        return CodePush.getJSBundleFile();
        }
    
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNCWebViewPackage(),
            new RNGestureHandlerPackage(),
            new VectorIconsPackage(),
            new CodePush(CODEPUSH_KEY_PRODUCTIO, getApplicationContext(), BuildConfig.DEBUG)
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
