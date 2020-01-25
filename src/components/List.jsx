import styled from 'styled-components/macro';


export const List = styled.ul`
  padding: 0px;
  margin: 0px;
  list-style-type: none;
`
export const ListItem = styled.li`
  padding: 0px;
  margin-bottom: ${props => props.theme.spacer}px;
`
