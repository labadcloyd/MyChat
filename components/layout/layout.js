import MainNavigation from './main-navigation';

function Layout(props) {
  return (
    <>
      <MainNavigation />
      <div style={{height:'100vh', paddingTop:'60px', boxSizing:'border-box'}}>
        {props.children}
      </div>
    </>
  );
}

export default Layout;