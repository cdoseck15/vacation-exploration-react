import axios from 'axios';
import { API_URL } from './private-constants';

//Sets up  an axios client to be used to maintain constants across all files.
export const useAxios = axios.create({
	baseURL: API_URL
});

//Uses an axios interceptor to handle errors returned from server.
useAxios.interceptors.response.use(
	(response) => {
		return response;
	}, async error => {
		//If there is no response then the problem is connecting to the server
		if (!error.response){
			alert('Cannot connect to the server.');
			return {data: {}};
		}
		//If the error is from an expired access token then refresh the token and send the request agiain
		else if (error.response.status == 401 && error.response.data == 'ACCESS_TOKEN_EXPIRED'){			
			//Get the response from the refresh token
			var response = await useAxios.post('/refresh_token', null, {headers: {refresh_token: localStorage.getItem('refresh_token')}});
			//If the status is 200 then assign the new tokens make the request again
			if(response.status == 200){
				localStorage.setItem('access_token', response.data.access_token);
				localStorage.setItem('refresh_token', response.data.refresh_token);
				switch(error.config.method){
				case 'get':
					response = await useAxios.get(error.config.url);
					break;
				case 'put':
					response = await useAxios.put(error.config.url, error.config.data);
					break;
				case 'post':
					response = await useAxios.post(error.config.url, error.config.data);
					break;
				case 'delete':
					response = await useAxios.delete(error.config.url);
					break;
				}
				return response;
			}
		}
		//If the error is from a bad refresh token remove the tokens and alert the user
		else if (error.response.status == 401 && error.response.data == 'INVALID_REFRESH_TOKEN'){
			localStorage.removeItem('access_token');
			localStorage.removeItem('refresh_token');
			alert('User credentials not included or invalid');
			window.location = '/';
		}
		else if (error.response.status == 401){
			alert('User credentials not included or invalid');
			window.location = '/';
		}
		//Return the error response
		return error.response;
	}
);

useAxios.interceptors.request.use(
	request => {
		request.headers.Authorization = localStorage.getItem('access_token');
		return request;
	}
);