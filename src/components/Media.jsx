import styled from 'styled-components/macro';


export const PrintOnly = styled.span`
  display: none;
  @media print {
    display: inherit;
  }
`
export const ScreenOnly = styled.span`
  @media print {
    display: none;
  }
`
