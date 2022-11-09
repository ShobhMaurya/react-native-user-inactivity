import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { TimeoutHandler } from 'usetimeout-react-hook';
/**
 * UserInactivityAPI is the type of an object providing the API supported by UserInactivity.
 * Such an object can be obtained via UserInactivity's optional getAPI property.
 */
export declare type UserInactivityAPI = {
    /**
     * Calling resetTimerDueToActivity() informs UserInactivity that some user activiity has occured.
     * This causes the inactivity timeout to be reset.
     */
    resetTimerDueToActivity: () => void;
    /**
     * Calling changeTimeForInactivity(newTimeForInactivity : number) sets how much time must pass without activity before onAction(active: boolean)'s called.
     * Also the inactivity timer's reset after changeTimeForInactivity()'s called.
     */
    changeTimeForInactivity: (newTimeForInactivity: number) => void;
};
export interface UserInactivityProps<T = unknown> {
    /**
     * Number of milliseconds after which the view is considered inactive.
     * If it changed, the timer restarts and the view is considered active until
     * the new timer expires.
     * It defaults to 1000.
     */
    timeForInactivity?: number;
    /**
     * If it's explicitly set to `true` after the component has already been initialized,
     * the timer restarts and the view is considered active until the new timer expires.
     * It defaults to true.
     */
    isActive?: boolean;
    /**
     * Generic usetimeout-react-hook's TimeoutHandler implementation.
     * It defaults to the standard setTimeout/clearTimeout implementation.
     * See https://github.com/jkomyno/usetimeout-react-hook/#-how-to-use.
     */
    timeoutHandler?: TimeoutHandler<T>;
    /**
     * Children components to embed inside UserInactivity's View.
     * If any children component is pressed, `onAction` is called after
     * `timeForInactivity` milliseconds.
     */
    children: React.ReactNode;
    /**
     * If set to true, the timer is not reset when the keyboard appears
     * or disappears.
     */
    skipKeyboard?: boolean;
    /**
     * Optional custom style for UserInactivity's View.
     * It defaults to { flex: 1 }.
     */
    style?: StyleProp<ViewStyle>;
    /**
     * Callback triggered anytime UserInactivity's View isn't touched for more than
     * `timeForInactivity` seconds.
     * It's `active` argument is true if and only if the View wasn't touched for more
     * than `timeForInactivity` milliseconds.
     */
    onAction: (active: boolean) => void;
    /**
     * Optional callback which, if present, is automatically called whenever its UserInactivity component is used.
     * The callback is passed a single parameter of type UserInactivityAPI.
     * The properties of this object are the API methods provided by UserInactivity.
     */
    getAPI?: (api: UserInactivityAPI) => any;
}
declare const UserInactivity: React.FC<UserInactivityProps>;
export default UserInactivity;
