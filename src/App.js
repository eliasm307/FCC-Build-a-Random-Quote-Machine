import React from "react"; 

import "./styles.scss";

var $ = require('jQuery');


//"use strict";

/*
TODO
- Add feature to show history of quotes received including timestamps
- Add feature that searches for an image of the author using the name and shows the first image in a circle on the left
- Fix hover colour change for icons
*/

////////////////////////////////////////////////////////////////////////////////////////
//Variables
////////////////////////////////////////////////////////////////////////////////////////
let quotesData; //response schema - [{"quote":text, "author":text}]
let oCurrentQuote;
let interval_gradient;

const colors = [
  "#16a085",
  "#27ae60",
  "#2c3e50",
  "#f39c12",
  "#e74c3c",
  "#9b59b6",
  "#FB6964",
  "#342224",
  "#472E32",
  "#BDBB99",
  "#77B1A9",
  "#73A857"
];

const arrShareButtons = [
  {
    id: "tweet-quote",
    iconName: "fa fa-twitter",
    link: "https://twitter.com/intent/tweet", //included just to pass FCC tests
    clickAction(currentQuote, currentAuthor) {
      console.log(
        "Twitter clicked start, oCurrentQuote.quote: " +
          oCurrentQuote.quote +
          "; oCurrentQuote.author: " +
          oCurrentQuote.author
      );
      if (!inIframe() || true) {
        console.log(
          "Twitter open url: " +
            "https://twitter.com/intent/tweet?hashtags=quotes&related=freecodecamp&text=" +
            encodeURIComponent(
              '"' + oCurrentQuote.quote + '" ' + oCurrentQuote.author
            )
        );
        window.open(
          "https://twitter.com/intent/tweet?hashtags=quotes&related=freecodecamp&text=" +
            encodeURIComponent(
              '"' + oCurrentQuote.quote + '" ' + oCurrentQuote.author
            )
        );
      } else {
        console.log("Twitter clicked: inframe");
      }

      console.log("Twitter clicked end");
    }
  },
  /* No web intents supported
  {
    id: "instagram-quote",
    iconName: "fa fa-instagram"
  },
  */
  /* TODO figure out if there is a working option available for Facebook
  {
    id: "facebook-quote",
    iconName: "fa fa-facebook",
    clickAction() {
      window.alert("Facebook clicked start, oCurrentQuote.quote: ");
      window.open(
        "http://www.facebook.com/sharer.php?s=100&p[title]=YOURTITLE&p[summary]=shortandsweetok"
      );
    } 
  },*/
  {
    id: "tumblr-quote",
    iconName: "fa fa-tumblr",
    clickAction() {
      //window.alert("Tumblr clicked start, oCurrentQuote.quote: ");
      window.open(
        "https://www.tumblr.com/widgets/share/tool?posttype=quote&tags=quotes,freecodecamp&caption=" +
          encodeURIComponent(oCurrentQuote.author) +
          "&content=" +
          encodeURIComponent(oCurrentQuote.quote) +
          "&canonicalUrl=https%3A%2F%2Fwww.tumblr.com%2Fbuttons&shareSource=tumblr_share_button"
      );
    }
  }
];

//console.log(arrShareButtons);
////////////////////////////////////////////////////////////////////////////////////////
//Functions
////////////////////////////////////////////////////////////////////////////////////////

//Check to make sure document is not in iFrame
function inIframe() {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}

//API call to get array of quotes stored in a local variable
function getQuotes() {
  return $.ajax({
    headers: {
      Accept: "application/json"
    },
    url:
      "https://gist.githubusercontent.com/camperbot/5a022b72e96c4c9585c32bf6a75f62d9/raw/e3c6895ce42069f0ee7e991229064f167fe8ccdc/quotes.json",
    success: function (jsonQuotes) {
      if (typeof jsonQuotes === "string") {
        quotesData = JSON.parse(jsonQuotes).quotes;
        console.log("quotesData", quotesData.length, "example", quotesData[0]);
      }
    }
  });

  //response schema - [{"quote":text, "author":text}]
}

//Returns a random integer below a certain limit
function randInt(limit) {
  //console.log("randInt with limit: ", limit);
  return Math.floor(Math.random() * limit);
}

//Updates the background with animations
function updateBg() {
  console.log("updateBg", Date());

  /*console.log(
    "Random color",
    randInt(colors.length),
    colors[randInt(colors.length)]
  );*/

  let color1 = colors[randInt(colors.length)];
  let color2 = colors[randInt(colors.length)];

  //console.log("colors:", color1, color2, "/", colors.length);

  let interval = 0;
  let gradient_percent = 0;
  let interval_value = 5;

  /*OLD var interval_gradient = setInterval(function () {
    if (interval == 100) clearInterval(interval_gradient);

    gradient_percent += interval_value;
    $("#wrapper").css(
      "background", "linear-gradient(45deg, " color1 + "," + color2  + ")"
    );

    ++interval;
  }, 50);*/

  //make sure there are no functions currently running
  clearInterval(interval_gradient);

  //solution from https://stackoverflow.com/a/19078838/8679035
  interval_gradient = setInterval(function () {
    if (gradient_percent == 360) {
      clearInterval(interval_gradient);
      gradient_percent = 0;
    }

    gradient_percent++;

    /*OLD $("#wrapper").css(
      "background",
      "linear-gradient(to right," +
        color1 +
        " " +
        gradient_percent +
        "%, " +
        color2 +
        " 100%)"
    );

   OLD  $("#wrapper").css(
      "background",
      "-webkit-gradient(to right," +
        color1 +
        " " +
        gradient_percent +
        "%, " +
        color2 +
        " 100%)"
    );*/

    //console.log("linear-gradient("+ gradient_percent +"deg, " + color1 + "," + color2  + ")");

    $("#wrapper").css(
      "background",
      "linear-gradient(" +
        gradient_percent +
        "deg, " +
        color1 +
        "," +
        color2 +
        ")"
    );

    ++interval;
  }, 0.5);

  console.log("updateBg end", Date());

  $("i").css("color", color1);
}

//Get update quote shown with animations
function getQuote() {
  console.log("getQuote", Date());

  updateBg();

  console.log("quotesData length:", quotesData.length);

  if (quotesData === undefined) return "Error getting quotes!";

  let i = Math.floor(Math.random() * quotesData.length);

  console.log("get quote no.", i);

  oCurrentQuote = quotesData[i];

  //oCurrentQuote = quotesData[0];

  console.log("Quote set to: ", oCurrentQuote);

  console.log("oCurrentQuote.author", oCurrentQuote.author);

  return oCurrentQuote;
}

////////////////////////////////////////////////////////////////////////////////////////
//React
////////////////////////////////////////////////////////////////////////////////////////

class QuoteText extends React.Component {
  constructor(props) {
    console.log("QuoteText constructor");
    super(props);
  }
  render() {
    console.log("QuoteText render, this.props.author", this.props.author);
    return (
      <div id="text" className="show-border">
        <i className="fa fa-quote-left"></i> <span>{this.props.quote}</span>
      </div>
    );
  }
}

class QuoteAuthor extends React.Component {
  constructor(props) {
    console.log("QuoteAuthor constructor");
    super(props);
  }
  render() {
    console.log("QuoteAuthor render, this.props.author", this.props.author);

    return (
      <div id="author" className="show-border">
        <p>{"- " + this.props.author}</p>
      </div>
    );
  }
}

class ButtonsContainer extends React.Component {
  constructor(props) {
    console.log("ButtonsContainer constructor");
    super(props);
  }
  render() {
    console.log("ButtonsContainer render, PROPS", this.props);

    //generate JSX for buttons
    const shareButtons = arrShareButtons.map((e) => (
      <a
        id={e.id}
        className="show-border col-md icon-centered"
        onClick={e.clickAction}
        href={typeof e.link == "string" ? e.link : ""}
      >
        <i className={e.iconName}></i>
      </a>
    ));

    return (
      <div id="button-container" class="show-border row no-gutters">
        {shareButtons}
        <div
          className={"show-border col-md-" + (12 - 4 - arrShareButtons.length)}
        ></div>
        <a
          id="new-quote"
          className="show-border col-md-2 icon-centered"
          onClick={this.props.handleNewQuote}
        >
          <i className="fa fa-refresh"></i>
        </a>
      </div>
    );
  }
}

class QuoteBox extends React.Component {
  constructor(props) {
    console.log("QuoteBox constructor");
    super(props);
    console.log("QuoteBox constructor2", oCurrentQuote);

    this.state = {
      author: "",
      quote: ""
    };

    console.log("QuoteBox constructor state set");

    this.newQuote = this.newQuote.bind(this);

    console.log("QuoteBox constructor after bind");

    //load quotes array then load initial quote
    getQuotes().then(() => {
      console.log("after getting quotes");
      this.newQuote();
    });
  }

  newQuote() {
    console.log("new quote click handler");
    getQuote();

    this.setState({
      author: oCurrentQuote.author,
      quote: oCurrentQuote.quote
    });
  }

  render() {
    console.log("QuoteBox render");
    return (
      <div id="quote-box" className="quote-container center">
        <QuoteText quote={this.state.quote} />
        <QuoteAuthor author={this.state.author} />
        <ButtonsContainer handleNewQuote={this.newQuote} />
      </div>
    );
  }
}

// ReactDOM.render(<QuoteBox />, document.getElementById("wrapper2"));


///////////////////////////////////////////
export default function App() {
  return (
    <QuoteBox />
  );
}

