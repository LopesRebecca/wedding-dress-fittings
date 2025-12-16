import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import BookingForm from "@/components/BookingForm";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div id="hero">
        <Hero />
      </div>
      <Services />
      <BookingForm />
      <Footer />
    </main>
  );
};

export default Index;
