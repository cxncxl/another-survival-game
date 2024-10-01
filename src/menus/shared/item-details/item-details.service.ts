import { Service } from "../../../basics/service/service";
import { environment } from "../../../env/environment";
import { ItemDetails } from "../model/craft.model";

export class ItemDetailsService extends Service {
    getItemDetails(itemId: number) {
        return this.fetch<ItemDetails>(`${environment.API_URL}/items/${itemId}/details`);
    }
}