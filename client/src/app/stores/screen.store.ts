import { computed, inject } from '@angular/core'
import{ patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals'
import { DeviceDetectorService } from 'ngx-device-detector'
export interface IScreenState {
    isMobile: boolean,
    isPortrait: boolean
}

export const ScreenStateStore = signalStore(
    withState<IScreenState>({
        isMobile: false,
        isPortrait: false
    }),
    withMethods((store, deviceService = inject(DeviceDetectorService)) => ({
        checkScreen() {
            patchState(store, {
                isMobile: deviceService.isMobile() || deviceService.isTablet(),
                isPortrait: deviceService.orientation === 'portrait'
            })
        },
        setIsMobile(isMobile: boolean) {
            patchState(store, {
                isMobile: isMobile,
            })
        },
        setIsPortrait(isPortrait: boolean) {
            patchState(store, {
                isPortrait: isPortrait
            })
        }
    })),
    withComputed((store) =>({
        isMobilePortrait: computed(() => store.isMobile() && store.isPortrait())
    })),
    withHooks({
        onInit(store) {
            store.checkScreen();
        }
    })
)