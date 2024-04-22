
export class RoomObjectExtension extends RoomObject {
    refGetter():string{
        if('id' in this){
            return this['id']
        }
        else if('name' in this){
            return this['name']
        }
        else{
            return ''
        }
    }
}
