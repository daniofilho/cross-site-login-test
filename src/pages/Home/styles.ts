import styled from "styled-components";

export const Container = styled.div`
  padding: 2rem;
  text-align: center;

  button {
    cursor: pointer;
    background-color: #1a73e8;
    border-width: 0;
    padding: 10px 20px;
    color: #ffffff;
    border-radius: 3px;
    height: 38px;
  }

  input,
  input:active,
  input:focus,
  input:hover {
    border-radius: 4px;
    border: 1px solid #dadce0;
    color: #202124;
    font-size: 16px;
    height: 38px;
    margin: 1px 1px 0 1px;
    padding: 5px 10px;
  }

  section {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 2rem;
  }
`;
