// SPDX-License-Identifier: MIT
// Copyright (c) 2023 Allan Pereira <https://github.com/allanpereira99>

import { ILocale } from './interfaces/locale_interface';
import { ResultEpic } from './utils/resultEpic_mapper';
import { HttpService } from './repositories/httpService';

const API_BASE_URL = 'https://store-site-backend-static-ipv4.ak.epicgames.com';

export async function getFreeGames(locale: ILocale) {
    const api = `${API_BASE_URL}/freeGamesPromotions?locale=${locale.language}&country=${locale.countryCode}&allowCountries=${locale.countryCode}`
    const httpService = new HttpService();
    try {
        const response = await httpService.get(api);
        return response.reduce((previousValue: ResultEpic[], currentValue) => {
            const resultEpic = ResultEpic.fromJSON(currentValue);
            if (resultEpic.data.price.totalPrice.discount && resultEpic.data.price.totalPrice.discountPrice == 0) {
                previousValue.push(resultEpic);
            }
            return previousValue;
        }, []);
    } catch (error) {
        console.error(error);
        return [];
    }
}
