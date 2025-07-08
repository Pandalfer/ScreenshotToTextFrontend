import axios from 'axios';

const api = axios.create({
	baseURL: "https://screenshottotextbackend.onrender.com"
})

export default api
