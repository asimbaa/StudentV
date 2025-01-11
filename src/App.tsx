import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './components/auth/AuthProvider';
import { SEOProvider } from './components/seo/SEOProvider';
import { AnalyticsProvider } from './components/seo/AnalyticsProvider';
import { ScrollToTop } from './components/navigation/ScrollToTop';
import { Breadcrumbs } from './components/navigation/Breadcrumbs';
import { ChatWindow } from './components/chat';
import { BackgroundSlideshow } from './components/background';
import { ProtectedDashboard } from './components/ProtectedDashboard';
import { NotificationContainer } from './components/ui/NotificationContainer';
import Header from './components/Header';
import Footer from './components/Footer';

// Pages
import { lazy, Suspense } from 'react';
import { ErrorBoundary } from './lib/utils/errorBoundary';
import { LoadingState } from './components/ui/LoadingState';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const EligibilityCheck = lazy(() => import('./pages/EligibilityCheck'));
const VisaTypes = lazy(() => import('./pages/VisaTypes'));
const Resources = lazy(() => import('./pages/Resources'));
const Blog = lazy(() => import('./pages/Blog'));
const Contact = lazy(() => import('./pages/Contact'));
const SignIn = lazy(() => import('./pages/SignIn'));
const Register = lazy(() => import('./pages/Register'));
const GoogleAuthCallback = lazy(() => import('./components/auth/GoogleAuthCallback').then(m => ({ default: m.GoogleAuthCallback })));
const ResourceGuides = lazy(() => import('./pages/resources/ResourceGuides'));
const ResourceVideos = lazy(() => import('./pages/resources/ResourceVideos'));
const ResourceLinks = lazy(() => import('./pages/resources/ResourceLinks'));
const ResourceFAQ = lazy(() => import('./pages/resources/ResourceFAQ'));
const ScholarshipExplorer = lazy(() => import('./pages/ScholarshipExplorer'));
const FinancialPlanner = lazy(() => import('./pages/FinancialPlanner'));
const ApplicationStatus = lazy(() => import('./pages/ApplicationStatus'));
const DocumentUpload = lazy(() => import('./pages/DocumentUpload'));
const SearchResults = lazy(() => import('./pages/SearchResults'));

function App() {
  return (
    <AuthProvider>
      <Router>
        <AnalyticsProvider>
          <SEOProvider>
            <ScrollToTop />
            <ErrorBoundary>
              <div className="min-h-screen font-inter relative flex flex-col bg-[hsl(var(--navy))]">
                <BackgroundSlideshow />
                <Header />
                <Breadcrumbs />
                <main className="container mx-auto px-4 py-8 relative z-10 flex-grow">
                  <Suspense fallback={<LoadingState message="Loading page..." />}>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/services" element={<Services />} />
                      <Route path="/dashboard/*" element={<ProtectedDashboard />}>
                        <Route path="overview" element={<Dashboard />} />
                        <Route path="applications" element={<ApplicationStatus />} />
                        <Route path="documents" element={<DocumentUpload />} />
                      </Route>
                      <Route path="/eligibility-check" element={<EligibilityCheck />} />
                      <Route path="/visa-types" element={<VisaTypes />} />
                      <Route path="/resources" element={<Resources />}>
                        <Route path="guides" element={<ResourceGuides />} />
                        <Route path="videos" element={<ResourceVideos />} />
                        <Route path="links" element={<ResourceLinks />} />
                        <Route path="faq" element={<ResourceFAQ />} />
                        <Route path="scholarships" element={<ScholarshipExplorer />} />
                        <Route path="financial-planner" element={<FinancialPlanner />} />
                      </Route>
                      <Route path="/blog/*" element={<Blog />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/signin" element={<SignIn />} />
                      <Route path="/search" element={<SearchResults />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/auth/callback/google" element={<GoogleAuthCallback />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </Suspense>
                </main>
                <Footer />
                <ChatWindow />
                <NotificationContainer />
              </div>
            </ErrorBoundary>
          </SEOProvider>
        </AnalyticsProvider>
      </Router>
    </AuthProvider>
  );
}

export default App;