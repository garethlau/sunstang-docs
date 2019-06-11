import React, {useState} from 'react';


const searchStyle = {
    border: "2px solid black",
    paddingLeft: "5px",
    paddingRight: "5px",
    paddingTop: "5px",
    paddingBottom: "3px",
    borderRadius: "5px"
}

const SearchBar = () => {

    const [query, setQuery] = useState("");

    const handleChange = (e) => {
        // console.log("value", e.target.value);
        // console.log("query", query)
        setQuery({
            query: e.target.value
        });

        // call search api and a lot of other stuff
    }

    return(
        <li style={{float: "right", paddingTop: "10px", marginRight: "20px"}}>
            <input type="text" placeholder="I'm looking for..." onChange={handleChange} style={searchStyle}></input>
        </li>
    )
}

export default SearchBar;