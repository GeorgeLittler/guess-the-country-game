import React from "react";
import { useNavigate } from "react-router-dom";
import MissingMarzy from '../Intro/MissingMarzy.png';
import Navbar from "../../components/Navbar";
import { useAuth } from '../../hooks/useAuth'; // Ensure correct import path
import './Rules.css';

const Rules = () => {
    const navigate = useNavigate();
    const { isLoggedIn, logout } = useAuth(); // Use the useAuth hook to get isLoggedIn and logout

    const navToIntro = () => {
        navigate("/");
    };

    return (
        <>
            <Navbar isLoggedIn={isLoggedIn} logout={logout} />
            <div className="rules-container">
                <h1 className="rules-header">Where's Marzy?</h1>
                <div className="content-container">
                    <div className="text-container">
                        <p className="rules-p-1">Marzy is in a random officially recognized European country and you need to work out which one he is in based off 
                         the clues provided in order to bring him home safely. There are 6 distinct categories of clues: Art and Literature,
                         Geography, History, Politics, Random Knowledge and Sport.
                        </p>
                        <p>You can have a maximum of 3 clues per round and they must each be of a different category however you will earn
                          more points for the less clues that you use. There are 5 rounds in the game - each clue category cannot be used 
                          more than 3 times in total. For the purposes of this game you can ignore the following European countries:</p>
                        <ul className="country-exceptions-list">
                            <li>Andorra</li>
                            <li>Liechtenstein</li>
                            <li>Malta</li>
                            <li>Monaco</li>
                            <li>San Marino</li>
                            <li>Vatican City</li>
                        </ul>
                    </div>
                    <img src={MissingMarzy} alt="Missing Marzy" className="rules-marzy" />
                </div>
                <button type="button" onClick={navToIntro} className="back-to-intro-btn">Back</button>
            </div>
        </>
    );
};

export default Rules;
