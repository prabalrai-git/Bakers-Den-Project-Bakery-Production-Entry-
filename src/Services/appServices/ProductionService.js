import { GetProductionDetailsByDate, InsertUpdateDayWiseProductionDetails } from "../constants/url";
// import { GenerateUrlEncodedData } from "../Helpers/GenerateUrlEncodedData";
// import { fetch, store } from "../Helpers/HttpUtil";
import { generateUrlEncodedData } from "../utils/generateUrlEncodedData";
import { fetch } from "../utils/httpUtil";

export const InsertUpdateDayWiseProductionDetail = async (data, successCallback) => {
    let formData = generateUrlEncodedData(data);
    // return
    try {
        const response = await fetch(`${InsertUpdateDayWiseProductionDetails}`, data);
        if (response?.status === 200) {
            console.log('sucessfull')
        } else
            console.log('error')
    } catch (error) {
        successCallback([])
    }
}

export const GetProductionDetailsDate = async (data, successCallback) => {
    try {
        const response = await fetch(`${GetProductionDetailsByDate}?fromdate=${data.fromdate}&todate=${data.todate}`);
        if (response?.status === 200) {
            console.log("sucess");
        } else {
            console.log("error")
        }
    } catch (errror) {
        successCallback([])
    }
}