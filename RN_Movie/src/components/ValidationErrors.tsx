import {View, Text} from 'react-native'

type Props = {
    errors: string[];
}

export default function ValidationErrors({errors}: Props){
    return (
        <View>
            {errors && (errors.map((err:string, i)=>(
                <Text key={i} style={{color:'red'}}>{err}</Text>
            )))}
        </View>
    );
}