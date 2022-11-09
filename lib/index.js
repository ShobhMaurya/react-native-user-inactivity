var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import React, { useEffect, useRef, useState, } from 'react';
import { Keyboard, PanResponder, View, } from 'react-native';
import { defaultTimeoutHandler, useTimeout, } from 'usetimeout-react-hook';
var defaultTimeForInactivity = 10000;
var defaultStyle = {
    flex: 1,
};
var callerSetTimeout = -1;
var UserInactivity = function (_a) {
    var children = _a.children, isActive = _a.isActive, onAction = _a.onAction, skipKeyboard = _a.skipKeyboard, style = _a.style, timeForInactivity = _a.timeForInactivity, timeoutHandler = _a.timeoutHandler, getAPI = _a.getAPI;
    var actualStyle = style || defaultStyle;
    if (getAPI)
        getAPI({
            resetTimerDueToActivity: resetTimerDueToActivity,
            changeTimeForInactivity: changeTimeForInactivity
        });
    /**
     * If the user has provided a custom timeout handler, it is used directly,
     * otherwise it defaults to the default timeout handler (setTimeout/clearTimeout).
     */
    var actualTimeoutHandler = timeoutHandler || defaultTimeoutHandler;
    //let timeout = timeForInactivity || defaultTimeForInactivity;
    var timeout = callerSetTimeout > 0 ? callerSetTimeout : (timeForInactivity || defaultTimeForInactivity);
    //const [ timeout, setTimeout ] = useState<number>(timeForInactivity || defaultTimeForInactivity);
    /**
     * If the `isActive` prop is manually changed to `true`, call `resetTimerDueToActivity`
     * to reset the timer and set the current state to active until the timeout expires.
     * If the `isActive` is changed to `false`, nothing is done.
     * Note however that toggling `isActive` manually is discouraged for normal use.
     * It should only be used in those cases where React Native doesnt't seem to
     * inform the `PanResponder` instance about touch events, such as when tapping
     * over the keyboard.
     */
    var initialActive = isActive === undefined ? true : isActive;
    var _b = useState(initialActive), active = _b[0], setActive = _b[1];
    useEffect(function () {
        if (isActive) {
            resetTimerDueToActivity();
        }
    }, [isActive]);
    var _c = useState(Date.now()), date = _c[0], setDate = _c[1];
    /**
     * The timeout is reset when either `date` or `timeout` change.
     */
    var cancelTimer = useTimeout(function () {
        setActive(false);
        onAction(false);
        // @ts-ignore
    }, timeout, actualTimeoutHandler, [date, timeout]);
    var isFirstRender = useRef(true);
    /**
     * Triggers `onAction` each time the `active` state turns true
     * after the initial render.
     */
    useEffect(function () {
        if (isFirstRender.current) {
            isFirstRender.current = false;
        }
        else {
            if (active) {
                onAction(true);
            }
        }
    }, [active]);
    /**
     * Resets the timer every time the keyboard appears or disappears,
     * unless skipKeyboard is true.
     */
    useEffect(function () {
        if (skipKeyboard) {
            return;
        }
        var hideEvent = Keyboard.addListener('keyboardDidHide', resetTimerDueToActivity);
        var showEvent = Keyboard.addListener('keyboardDidShow', resetTimerDueToActivity);
        // release event listeners on destruction
        return function () {
            hideEvent.remove();
            showEvent.remove();
        };
    }, []);
    /**
     * This method is called whenever a touch is detected. If no touch is
     * detected after `this.props.timeForInactivity` milliseconds, then
     * `this.state.inactive` turns to true.
     */
    function resetTimerDueToActivity() {
        cancelTimer();
        setActive(true);
        /**
         * Causes `useTimeout` to restart.
         */
        setDate(Date.now());
    }
    function changeTimeForInactivity(newTimeForInactivity) {
        callerSetTimeout = timeout = newTimeForInactivity;
        //setTimeout(newTimeForInactivity);
        resetTimerDueToActivity();
    }
    /**
     * In order not to steal any touches from the children components, this method
     * must return false.
     */
    function resetTimerForPanResponder( /* event: GestureResponderEvent */) {
        // const { identifier: touchID } = event.nativeEvent;
        resetTimerDueToActivity();
        return false;
    }
    /**
     * The PanResponder instance is initialized only once.
     */
    var _d = useState(PanResponder.create({
        onMoveShouldSetPanResponderCapture: resetTimerForPanResponder,
        onPanResponderTerminationRequest: resetTimerForPanResponder,
        onStartShouldSetPanResponderCapture: resetTimerForPanResponder,
    })), panResponder = _d[0], _ = _d[1];
    return (React.createElement(View, __assign({ style: actualStyle, collapsable: false }, panResponder.panHandlers), children));
};
export default UserInactivity;
