import { map, of } from "rxjs";
import { Service } from "../../basics/service/service";
import { environment } from "../../env/environment";
import { Item, CraftInput, CraftResult } from "../shared/model/craft.model";

export class CraftService extends Service {
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

    craft(input: CraftInput) {
        if (!input.items || input.items.length < 1) {
            throw new Error('No items specified');
        }

        if (!input.description) {
            throw new Error('No description specified');
        }

        return this.fetch<CraftResult>(`${environment.API_URL}/craft_item`, {
            method: 'POST',
            body: JSON.stringify(input),
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}