import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

export default function SessionsPage() {
  const { movieId } = useParams();
  const [sessions, setSessions] = useState([]);
  const [posterURL, setPosterURL] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await axios.get(
          `https://mock-api.driven.com.br/api/v8/cineflex/movies/${movieId}/showtimes`
        );
        const { days, posterURL, title } = response.data;
        setSessions(days);
        setPosterURL(posterURL);
        setTitle(title);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSessions();
  }, [movieId]);

  console.log(sessions);

  return (
    <PageContainer>
      Selecione o horário
      <div>
        {sessions.map((day) => (
          <SessionContainer key={day.id} data-test="movie-day">
            {day.weekday} - {day.date}
            <ButtonsContainer>
              {day.showtimes.map((showtime) => (
                <Link key={showtime.id} to={`/assentos/${showtime.id}`}>
                  <button data-test="showtime">{showtime.name}</button>
                </Link>
              ))}
            </ButtonsContainer>
          </SessionContainer>
        ))}
      </div>
      <FooterContainer data-test="footer">
        <div>
          <img src={posterURL} alt="poster" />
        </div>
        <div>
          <p>{title}</p>
        </div>
      </FooterContainer>
    </PageContainer>
  );
}

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  font-family: 'Roboto';
  font-size: 24px;
  text-align: center;
  color: #293845;
  margin-top: 30px;
  padding-bottom: 120px;
  padding-top: 70px;
  div {
    margin-top: 20px;
  }
`;
const SessionContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-family: 'Roboto';
  font-size: 20px;
  color: #293845;
  padding: 0 20px;
`;
const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin: 20px 0;
  button {
    margin-right: 20px;
  }
  a {
    text-decoration: none;
  }
`;
const FooterContainer = styled.div`
  width: 100%;
  height: 120px;
  background-color: #c3cfd9;
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 20px;
  position: fixed;
  bottom: 0;

  div:nth-child(1) {
    box-shadow: 0px 2px 4px 2px #0000001a;
    border-radius: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: white;
    margin: 12px;
    img {
      width: 50px;
      height: 70px;
      padding: 8px;
    }
  }

  div:nth-child(2) {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    p {
      text-align: left;
      &:nth-child(2) {
        margin-top: 10px;
      }
    }
  }
`;
