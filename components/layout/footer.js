import css from './footer.module.css'

function Footer() {

	const d = new Date();
	const year = d.getFullYear();

	return (
	  <>
		<div className={css.footerContainer}>
			<h1>©{year} Chat App</h1>
			<p>Designed and Developed by: <a href='https://github.com/labadcloyd'>Cloyd Abad</a></p>
		</div>
	  </>
	);
}
export default Footer;