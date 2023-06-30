import { FlatList, Text, View } from "react-native";
import CardMemo from "./Card";

type Props = { title: string, content: any };

export default function List({ title, content }: Props) {
    return (
        <>
            <View style={{ marginTop: 30 }}>
                <Text style={{ color: 'blue', fontSize: 25, fontWeight: 'bold' }}>{title}</Text>
            </View>

            <View>
                <FlatList
                    data={content}
                    renderItem={({ item }) => <CardMemo item={item} />}
                    keyExtractor={item => item.id}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false} />
            </View>
        </>
    );
}