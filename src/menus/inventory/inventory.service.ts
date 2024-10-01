import { map } from "rxjs";
import { Service } from "../../basics/service/service";
import { Item } from "../shared/model/craft.model";
import { environment } from "../../env/environment";

export class InventoryService extends Service {
    getAllItems() {
        return this.fetch<Item[]>(`${environment.API_URL}/items_list`)
        .pipe(
            map((items) => 
                items.map((item) => ({ 
                    ...item, 
                    image: `${environment.ASSETS_URL}${item.image.replace('\\', '/').replace('C:/xampp/htdocs/Game_Item', '')}` 
                }))
            )
        )
    }
}