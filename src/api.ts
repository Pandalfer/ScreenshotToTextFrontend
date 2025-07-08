import axios from 'axios';

const api = axios.create({
	baseURL: "https://screenshottotextbackend.onrender.com/image"
})

export default api
