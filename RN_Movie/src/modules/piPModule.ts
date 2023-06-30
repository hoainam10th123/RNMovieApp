import {NativeModules} from 'react-native';

const {PipModule} = NativeModules;

interface PipInterface {
    playVideoEvent(key: string): void
}

export default PipModule as PipInterface;