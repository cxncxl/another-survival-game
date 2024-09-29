import { Service } from "../basics/service/service";
import { environment } from "../env/environment";

export class CraftService extends Service {
    async getAllItems() {
        return this.fetch(`${environment.API_URL}/items_list`);
    }

    async getItemDetails(itemId: number) {
        return this.fetch(`${environment.API_URL}/items/${itemId}/details`);
    }
}