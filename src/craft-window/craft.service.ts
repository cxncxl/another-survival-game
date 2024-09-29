import { map } from "rxjs";
import { Service } from "../basics/service/service";
import { environment } from "../env/environment";

export class CraftService extends Service {
    getAllItems() {
        return this.fetch<Item[]>(`${environment.API_URL}/items_list`).pipe(
            map((items) => 
                items.map((item) => ({ 
                    ...item, 
                    image: `${environment.ASSETS_URL}${item.image.replace('\\', '/').replace('C:/xampp/htdocs/Game_Item', '')}` 
                }))
            )
        )
    }

    getItemDetails(itemId: number) {
        return this.fetch(`${environment.API_URL}/items/${itemId}/details`);
    }

    craft(input: CraftInput) {
        if (!input.items || input.items.length < 1) {
            throw new Error('No items specified');
        }

        if (!input.description) {
            throw new Error('No description specified');
        }

        return this.fetch(`${environment.API_URL}/craft_item`, {
            method: 'POST',
            body: JSON.stringify(input),
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}

type CraftInput = {
    items: { id: number, amount: number }[];
    description: string;
}

type Item = {
    image: string;
    name: string;
    id: number;
}