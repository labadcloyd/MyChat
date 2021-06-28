import MainNavigation from './main-navigation';

function Layout(props) {
  return (
    <>
      {/* <MainNavigation /> */}
      <div style={{height:'100%'}}>
        {props.children}
      </div>
    </>
  );
}

export default Layout;