import axios from "axios";
async function fetchData(value, page) {
    let URL = "https://pixabay.com/api/?key=33388520-da97c6f4f9d55a18accdd6f94&image_type=photo";
    const response = await axios.get(`${URL}&q=${value}&page=${page}&per_page=30&orientation="horizontal"&safesearch=true`);
    return response;
}

export { fetchData };