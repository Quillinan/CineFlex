import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function SeatsPage() {
  const { sessionId } = useParams();
  const [seats, setSeats] = useState([]);
  const [movie, setMovie] = useState('');
  const [day, setDay] = useState('');
  const [name, setName] = useState('');
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [buyerName, setBuyerName] = useState('');
  const [buyerCPF, setBuyerCPF] = useState('');

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const response = await axios.get(
          `https://mock-api.driven.com.br/api/v8/cineflex/showtimes/${sessionId}/seats`
        );
        const { seats, movie, day, name } = response.data;
        setSeats(seats);
        setMovie(movie);
        setDay(day);
        setName(name);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSeats();
  }, [sessionId]);

  const handleSeatClick = (seat) => {
    if (seat.isAvailable) {
      const isSelected = selectedSeats.some(
        (selectedSeat) => selectedSeat.id === seat.id
      );

      if (isSelected) {
        setSelectedSeats((prevSelectedSeats) =>
          prevSelectedSeats.filter(
            (selectedSeat) => selectedSeat.id !== seat.id
          )
        );
      } else {
        setSelectedSeats((prevSelectedSeats) => [...prevSelectedSeats, seat]);
      }
    } else {
      alert('Esse assento não está disponível');
    }
  };

  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!buyerName || !buyerCPF) {
      alert('Por favor, preencha seu nome e CPF');
      return;
    }

    if (selectedSeats.length === 0) {
      alert('Por favor, selecione pelo menos um assento');
      return;
    }

    try {
      const data = {
        ids: selectedSeats.map((seat) => seat.id),
        name: buyerName,
        cpf: buyerCPF,
      };

      const response = await axios.post(
        'https://mock-api.driven.com.br/api/v8/cineflex/seats/book-many',
        data
      );

      if (response.status === 200) {
        const reservationData = {
          ids: data.ids,
          name: data.name,
          cpf: data.cpf,
          selectedSeats,
          movieTitle: movie.title,
          dayDate: day.date,
          time: name,
        };

        navigate('/success-page', { state: { reservationData } });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <PageContainer>
      Selecione o(s) assento(s)
      <SeatsContainer>
        {seats.map((seat) => (
          <SeatItem
            key={seat.id}
            isAvailable={seat.isAvailable}
            seat={seat}
            onClick={() => handleSeatClick(seat)}
            isSelected={selectedSeats.some(
              (selectedSeat) => selectedSeat.id === seat.id
            )}
          >
            {seat.name}
          </SeatItem>
        ))}
      </SeatsContainer>
      <CaptionContainer>
        <CaptionItem>
          <CaptionCircle word="Selecionado" />
          Selecionado
        </CaptionItem>
        <CaptionItem>
          <CaptionCircle word="Disponível" />
          Disponível
        </CaptionItem>
        <CaptionItem>
          <CaptionCircle word="Indisponível" />
          Indisponível
        </CaptionItem>
      </CaptionContainer>
      <FormContainer>
        Nome do Comprador:
        <input
          placeholder="Digite seu nome..."
          value={buyerName}
          onChange={(event) => setBuyerName(event.target.value)}
        />
        CPF do Comprador:
        <input
          placeholder="Digite seu CPF..."
          value={buyerCPF}
          onChange={(event) => setBuyerCPF(event.target.value)}
        />
        <button onClick={handleSubmit}>Reservar Assento(s)</button>
      </FormContainer>
      <FooterContainer>
        <div>
          <img src={movie.posterURL} alt="poster" />
        </div>
        <div>
          <p>{movie.title}</p>
          <p>
            {day.weekday} - {name}
          </p>
        </div>
      </FooterContainer>
    </PageContainer>
  );
}

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Roboto';
  font-size: 24px;
  text-align: center;
  color: #293845;
  margin-top: 30px;
  padding-bottom: 120px;
  padding-top: 70px;
`;
const SeatsContainer = styled.div`
  width: 330px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
`;
const FormContainer = styled.div`
  width: calc(100vw - 40px);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 20px 0;
  font-size: 18px;
  button {
    align-self: center;
  }
  input {
    width: calc(100vw - 60px);
  }
`;
const CaptionContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 300px;
  justify-content: space-between;
  margin: 20px;
`;
const CaptionCircle = styled.div`
  background-color: ${({ word }) => {
    if (word === 'Disponível') {
      return '#C3CFD9';
    } else if (word === 'Indisponível') {
      return '#FBE192';
    } else {
      return '#1AAE9E';
    }
  }};
  border: ${({ word }) => {
    if (word === 'Disponível') {
      return '1px solid #7B8B99';
    } else if (word === 'Indisponível') {
      return '1px solid #F7C52B';
    } else {
      return '1px solid #0E7D71';
    }
  }};

  height: 25px;
  width: 25px;
  border-radius: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 5px 3px;
`;
const CaptionItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 12px;
`;
const SeatItem = styled.div`
  background-color: ${(props) => (props.isAvailable ? '#C3CFD9' : '#FBE192')};
  border: ${(props) =>
    props.isAvailable ? '1px solid #808F9D' : '1px solid #F7C52B'};

  ${({ isSelected }) =>
    isSelected &&
    `
    background-color: #1AAE9E;
    border: 1px solid #0E7D71;
  `}

  height: 25px;
  width: 25px;
  border-radius: 25px;
  font-family: 'Roboto';
  font-size: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 5px 3px;
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
