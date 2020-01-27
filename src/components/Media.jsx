import styled from 'styled-components/macro';


export const PrintOnly = styled.span`
  display: none;
  @media print {
    display: inline;
  }
`
export const ScreenOnly = styled.span`
  display: inline;
  @media print {
    display: none;
  }
`
