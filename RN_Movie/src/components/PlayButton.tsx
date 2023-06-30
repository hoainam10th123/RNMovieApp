import { Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

type Props = {
    handlePress: () => void
}

export default function PlayButton({handlePress}: Props) {

    return (
        <Pressable onPress={handlePress}>
            <Icon name="play-circle" size={60} color="#4481FC" />            
        </Pressable>
    )
}