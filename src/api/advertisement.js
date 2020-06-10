import request from '@/utils/request'

export function fetchList(params) {
    return request({
        url: '/advertisement/search',
        method: 'post',
        data: params
    })
}

export function createAdvertisement(params) {
    return request({
        url: "/advertisement",
        method: "post",
        data: params
    })
}

export function deleteAdvertisement(params){
    return request(
        {
            url:"/advertisement",
            method: "delete",
            params
        }
    )
}

export function updateAdvertisement(params){
    return request({
        url:"/advertisement",
        method:"put",
        data: params
    })
}