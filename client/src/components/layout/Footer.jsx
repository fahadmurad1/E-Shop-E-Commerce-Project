const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 py-8 text-center border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="mb-4">
          &copy; {currentYear} E-SHOP. All rights reserved.
        </p>
        <div className="flex justify-center space-x-4 text-sm">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors">Contact Us</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
