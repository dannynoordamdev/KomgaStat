import React from "react";

const SetupComponentPage = () => {

    return(
        <>
        <p>Enter your username of your komga server here:</p>
        <input type="text" placeholder="username" />
        <p>Enter your password of your server here:</p>
        <input type="password" name="password" id="" />
        <a href="/">Read here server passwords are used and not stored for safety.</a>
        </>
    );
}

export default SetupComponentPage;