import { React, useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/footer";
import secureLocalStorage from "react-secure-storage";
import axios from "axios";
import Moment from "moment";
import moment from "moment";
import useDocumentTitle from "../components/useDocumentTitle";
import { Helmet } from "react-helmet";
export default function TermsConditions() {
  useDocumentTitle("Terms and Conditions");
  const [scroll, setScroll] = useState(false);
  const [Sidebar, setSidebar] = useState(false);
  const [login, setLogin] = useState(secureLocalStorage.getItem("UserData") ? secureLocalStorage.getItem("UserData").loggedin : false);
  const [DrawData, setDrawData] = useState([]);
  const [PrizeData, setPrizeData] = useState([]);
  const [prevDrawData, setPrevDrawData] = useState("");
  const [winnerData, setWinnerData] = useState([]);
  const parser = new DOMParser();

  const siteID = process.env.REACT_APP_SITE_ID;
  const APIURL = process.env.REACT_APP_API_URL;
  const [totalQuantities, setTotalQuantities] = useState(0);
  //let totalQuantity = 0;

  function calculateTotalQuantity(PrizeData) {
    let sum = 0;
    {
      PrizeData.forEach((item) => {
        sum += item.prizeQuantity;
      });
    }
    return sum;
  }

  useEffect(() => {
    window.addEventListener("scroll", () => {
      setScroll(window.scrollY > 10);
    });
    axios.get(APIURL + "/sites/" + siteID + "/draws").then((res) => {
      let alldraw = res.data.content;
      let activeDraw = res.data.content.filter((item) => item.drawIsClosed != 1);
      let selectedDraw = {};
      if (activeDraw.length > 0) {
        selectedDraw = activeDraw[0];
      } else {
        selectedDraw = alldraw[0];
      }
      setDrawData(selectedDraw);
    });
  }, []);

  useEffect(() => {
    //  https://api.playfundwin.com/api/v1/draws/42c3904b-dc6a-4ecc-8ffc-4767b5fcce3c/prizes
    axios
      .get(APIURL + `/draws/bc80e019-6ae9-423d-b1c0-ba4ebe1ebd1e/prizes`, {
        withCredentials: true,
        credentials: "same-origin",
      })
      .then((res) => {
        setPrizeData(res?.data?.content);
        setTotalQuantities(calculateTotalQuantity(res?.data?.content));
        // const quanities = PrizeData.map(item => item.prizeQuantity);
        // for(let i=0; i<quanities.length; i++){
        //   totalQuantity+=quanities[i];
        // }
      });
  }, [DrawData]);

  // useEffect(() => {
  //   axios.get(APIURL + `/draws/host/297ae8f5-7ba2-4b90-940d-be08ffb8a729`, {
  //     withCredentials: true,
  //     credentials: "same-origin"
  //   }
  //   ).then(res => {
  //     setPrevDrawData(res.data.content.filter(item => item.drawIsClosed === 1 && moment(item.drawEndDate) < moment()).sort((a, b) => new Date(a.drawEndDate) - new Date(b.drawEndDate)).reverse()[0]);
  //   }
  //   );
  // }, [])

  // useEffect(() => {
  //   axios.get(APIURL + `/draws/winners/all/${prevDrawData.drawID}/1/1000`, {
  //     withCredentials: true,
  //     credentials: "same-origin"
  //   }
  //   ).then(res => {
  //     setWinnerData(res?.data?.content?.winners);
  //   }
  //   );
  // }, [prevDrawData])
  console.log("Draw Data" + PrizeData);

  return (
    <>
      <Helmet>
        <title>Terms and Conditions | Your Guide to Hendrix Archive Draw Participation</title>
        <meta
          name="description"
          content="Understand the terms governing your participation in the draws, ensuring a seamless and enjoyable experience while contributing to a great cause."
        />
      </Helmet>
      <Header />
      <section className="content-section">
        <div className="container">
          <div className="terms-conditions-text text-capitalize">
            <h1 className="l-title mb-2">Terms and conditions</h1>
            <br />

            <h2 className="s-title mb-3">Charity partner</h2>

            <p>The charity partner for this fundraising programme is Hendrix ArchiveHendrix Archive.</p>
            <p>Hendrix Archive foundation, with registered charity number 1139229.</p>

            <h2 className="s-title mb-3">Statement of professional fundraising fees</h2>

            <p>All entrants acknowledge that after deduction of payment processing fees equal to 4% of contributions received:</p>

            <p>15% of all funds raised will go to the promoter and professional fundraiser.</p>

            <p>
              These fees help cover ongoing maintenance of the online donation platform, customer support services and marketing costs used to grow support for the charity partner
              to help them deliver their outstanding charitable initiatives.
            </p>

            <p>
              The promoter and professional fundraiser is PFW holdings Ltd (trading as Play Fund Win) with mailing address at PFW holdings Ltd suite#300, 4 blenheim court,
              peppercorn close, peterborough, pe1 2du.
            </p>

            <h2 className="s-title mb-3">Terms related to payments of monthly contributions</h2>

            <p>When you create your contribution plan, your first payment will be taken immediately when you register.</p>

            <p>Each month after that your next monthly contribution will be taken on the same day you signed up.</p>

            <p>For example, if you sign up on june 10th, your next contribution will be taken on the following july 10th.</p>

            <p>
              Requests for refunds will be acknowledged and issued in accordance with the consumer contracts regulations (2013). Any requests for refunds which are received 14 days
              after a contribution is made will be treated on a case by case basis.
            </p>

            <p>
              You can cancel your contribution plan at any time in your platform account. You will still be eligible for charity updates and automatic entry into rewards
              sweepstakes during any monthly term you have paid for.
            </p>

            <h2 className="s-title mb-3">Terms related to online accounts</h2>

            <p>Play fund win may terminate, vary or suspend the access to online accounts for breach of these terms, general maintenance, or other reasonable measures.</p>

            <p>It is the responsibility of the user to make sure that all signup details are accurate and true.</p>

            <p>
              The sharing of accounts and multiple accounts are prohibited and access to the services will be revoked if a user and/or users are found to have multiple or shared
              accounts. Users must not change their registered email addresses without confirming first with customer service, as this may affect the awarding of prize rewards.
            </p>

            <h2 className="s-title mb-3">
              Number of prizes for the sweepstakes draw on {DrawData?.drawEndDate ? Moment(DrawData.drawEndDate).format("LLL") : "-----, /--/--/-- 00:00PM"}
            </h2>
            <p>There are {totalQuantities} prizes.</p>
            <h2 className="s-title mb-3">Categories of matchday prizes</h2>

            {PrizeData.map((item) => {
              return (
                <>
                  <p>
                    {item.prizeQuantity} -
                    <span
                      className="col-md-4 winner-col px-2 mb-2"
                      dangerouslySetInnerHTML={{ __html: parser.parseFromString(`${item.prizeName}`, "text/html").body.textContent }}
                    />
                  </p>
                  {/* <div className='prize-content'>
                    {item.prizeDescription !== '-' ?
                    <div dangerouslySetInnerHTML={{ __html: item.prizeDescription }}></div>
                    : ""}
                    </div> */}
                </>
              );
            })}

            {/* 1 - VIP Mascots<br />1 - Player Experience Mascots<br /> */}

            <p>
              Prizes for matchday draws may change from time to time, but prizes amounts will never change once a sweepstake has started. Please check the homepage and these terms
              and conditions for the most recent prize structure.
            </p>

            <h2 className="s-title mb-3">Entry deadline</h2>

            <p>
              The deadline to enter the draw will be on {DrawData?.drawEndDate ? Moment(DrawData.drawEndDate).format("LLL") : "-----, /--/--/-- 00:00PM"}. Any postal entries
              received after this deadline will be added to the next matchday draw.
            </p>

            <h2 className="s-title mb-3">Winner announcement for matchday sweepstake draws</h2>

            <p>Winners will be chosen by {DrawData?.drawEndDate ? Moment(DrawData.drawEndDate).format("LLL") : "-----, /--/--/-- 00:00PM"}.</p>

            <p>
              All winners will also be notified by email. Winners who have entered via postal entry will be notified by post if they do not include an email address with their
              entry. A record of winners is available on request and is subject to gdpr considerations.
            </p>

            <h2 className="s-title mb-3">Who is eligible to win a prize?</h2>

            <p>Eligible entrants must be at least 18 years old to win a prize. All entrants must verify their age and identity before claiming a prize.</p>

            <p>
              Entrants must not be residents of belgium, cuba, indonesia, iran, iraq, italy, north korea, singapore, sudan, syria or thailand. Any entries from residents of the
              aforementioned countries will be deemed ineligible and are non-refundable. Entries are also subject to all local laws and certain conditions in foreign jurisdictions
              may prevent the issuing of a prize. Employees, officers, or immediate family members of the charity partners, sponsors or contest promoters are not eligible to
              receive a prize.
            </p>

            <p>Entrants may be required to confirm their age, identity and location before they can receive a cash prize.</p>

            <h2 className="s-title mb-3">Methods of entry</h2>

            <p>We offer two methods of entry:</p>

            <i>Automatic entry with contribution</i>

            <p>To contribute to our amazing cause, you can select specific plans that correspond with a given amount of automatic entries.</p>

            <p>
              <i>To enter for free via post</i>
            </p>

            <p>
              While we encourage you to contribute to the great cause we support, you can enter for free via post. There is no limit on the number of times you can enter for free.
              For 5 non-donation entries to the prize draw please post the following information:
            </p>

            <p>First name, last name, email </p>

            <p>To: </p>
            <p>PFW Holdings Ltd c/o samh, suite#300, 4 blenheim court, peppercorn close, peterborough, pe1 2du.</p>

            <p>
              As entry with a contribution plan occurs for all draws within a given month, and requires renewal each month. You will receive the same treatment as a free entry,
              meaning you will be entered into all draws for a given 31 day period and required to renew your entry in accordance with the monthly renewal.
            </p>

            <h2 className="s-title mb-3">Selection process</h2>
            <p>
              Winners (subject to eligibility) will be chosen via our independently certified random number generator. This random number generator is proven to be statistically
              random to ensure fairness, and goes above and beyond regular computer applications which include random functionality.
            </p>

            <h2 className="s-title mb-3">Awarding prizes</h2>

            <p>Odds of winning depend on the number of entries an entrant has per draw.</p>
            <p>Winners may be required to sign paperwork re-confirming their eligibility as a winner. </p>
            <p>No purchase, payment, contribution is necessary to enter or win a prize..</p>
            <p>The winner will have 28 days to claim their prize.</p>

            <h2 className="s-title mb-3">Complaint procedure</h2>
            <p>
              If you have any complaints related to the promotional draw or fundraising practices we ask that you first reach out to the promoter and attempt to resolve your query.
              You can contact the promoter at:{" "}
              <a href="mailto:hello@playfundwin.com" className="text-lowercase">
                {" "}
                hello@playfundwin.com{" "}
              </a>
              .
            </p>
            <p>
              Complaints that relate to the promotional draw should be directed to the advertising standards authority. You can find information related to the asa’s complaint
              process here:{" "}
              <a className="text-lowercase" href="https://www.asa.org.uk/make-a-complaint.html" target="_blank">
                https://www.asa.org.uk/make-a-complaint.html
              </a>
            </p>

            <p>
              Complaints that relate to fundraising practices should be forwarded to the fundraising regulator. You can find information related to the fundraising regulator’s
              complaint process here:{" "}
              <a className="text-lowercase" href="https://www.fundraisingregulator.org.uk/more-from-us/resources/complaints-process" target="_blank">
                https://www.fundraisingregulator.org.uk/more-from-us/resources/complaints-process
              </a>
            </p>

            <h2 className="s-title mb-3">Final terms</h2>
            <p>
              None of the promoter, the charity partner and its affiliated and related entities, and/or member clubs, or any associated bodies, sponsors or partners shall be liable
              in contract, tort (including but not limited to negligence) or otherwise in connection with this fundraising initiative for:
            </p>
            <p>
              <span className="text-lowercase">(a)</span> loss of revenue, contract, profits, business or anticipated savings or loss of data;
            </p>
            <p>
              <span className="text-lowercase">(b)</span> any special or indirect or consequential losses;
            </p>
            <p>
              <span className="text-lowercase">(c)</span> any loss of goodwill or reputation; or
            </p>
            <p>
              <span className="text-lowercase">(d)</span> the loss of opportunity to enter a fundraising initiative and/or right to receive a prize
            </p>
            <p>
              The promoter makes no warranty, representation or guarantee that use of the websites, telephone system, broadcast or live transmission will be uninterrupted, timely
              and/or error-free
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
