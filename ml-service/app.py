from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
import os

# ML Service for Sales Predictions and Inventory Optimization
app = Flask(__name__)
CORS(app)

# Simple in-memory model (in production, load trained models)
class SalesPredictorModel:
    """Simple sales prediction model using moving averages and seasonal patterns."""
    
    def __init__(self):
        self.model_version = "1.0.0"
        self.trained_at = datetime.now()
    
    def predict(self, historical_data: list, days: int = 30) -> list:
        """Generate sales predictions for the next N days."""
        if not historical_data:
            # Return baseline predictions if no historical data
            return [self._generate_baseline(i) for i in range(days)]
        
        # Calculate moving average from historical data
        sales = [d.get('sales', 0) for d in historical_data]
        avg_sales = np.mean(sales) if sales else 10
        std_sales = np.std(sales) if len(sales) > 1 else avg_sales * 0.2
        
        predictions = []
        base_date = datetime.now()
        
        for i in range(days):
            future_date = base_date + timedelta(days=i + 1)
            day_of_week = future_date.weekday()
            
            # Apply seasonal patterns
            weekend_factor = 1.3 if day_of_week in [5, 6] else 1.0
            
            # Add some randomness for realistic predictions
            noise = np.random.normal(0, std_sales * 0.1)
            
            predicted_sales = max(0, int(avg_sales * weekend_factor + noise))
            confidence = min(0.95, max(0.60, 0.85 - (i * 0.005)))
            
            predictions.append({
                'date': future_date.strftime('%Y-%m-%d'),
                'predicted_sales': predicted_sales,
                'predicted_revenue': round(predicted_sales * 67.50, 2),  # Avg order value
                'confidence': round(confidence, 2)
            })
        
        return predictions
    
    def _generate_baseline(self, day_offset: int) -> dict:
        """Generate baseline predictions when no historical data available."""
        future_date = datetime.now() + timedelta(days=day_offset + 1)
        base_sales = 50 + np.random.randint(-10, 10)
        
        return {
            'date': future_date.strftime('%Y-%m-%d'),
            'predicted_sales': base_sales,
            'predicted_revenue': round(base_sales * 67.50, 2),
            'confidence': 0.70
        }


class InventoryOptimizerModel:
    """Inventory optimization model for reorder recommendations."""
    
    def __init__(self):
        self.model_version = "1.0.0"
    
    def recommend_reorder(self, current_stock: int, avg_daily_sales: float, 
                          lead_time_days: int = 7, safety_stock_days: int = 3) -> dict:
        """Calculate optimal reorder quantity and timing."""
        
        daily_demand = max(1, avg_daily_sales)
        safety_stock = int(daily_demand * safety_stock_days)
        reorder_point = int(daily_demand * lead_time_days) + safety_stock
        
        # Calculate urgency based on current stock vs reorder point
        if current_stock <= safety_stock:
            urgency = 'critical'
            days_until_stockout = max(0, int(current_stock / daily_demand))
        elif current_stock <= reorder_point:
            urgency = 'high'
            days_until_stockout = int((current_stock - safety_stock) / daily_demand)
        elif current_stock <= reorder_point * 1.5:
            urgency = 'medium'
            days_until_stockout = int(current_stock / daily_demand)
        else:
            urgency = 'low'
            days_until_stockout = int(current_stock / daily_demand)
        
        # Economic Order Quantity (simplified)
        recommended_order = int(daily_demand * 14)  # 2-week supply
        
        return {
            'reorder_point': reorder_point,
            'safety_stock': safety_stock,
            'recommended_order_quantity': recommended_order,
            'urgency': urgency,
            'days_until_stockout': days_until_stockout,
            'should_reorder': current_stock <= reorder_point
        }


# Initialize models
sales_model = SalesPredictorModel()
inventory_model = InventoryOptimizerModel()


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint for Kubernetes probes."""
    return jsonify({
        'status': 'healthy',
        'service': 'ml-service',
        'version': '1.0.0',
        'models': {
            'sales_predictor': sales_model.model_version,
            'inventory_optimizer': inventory_model.model_version
        }
    })


@app.route('/predict/sales', methods=['POST'])
def predict_sales():
    """Generate sales predictions."""
    try:
        data = request.json or {}
        historical_data = data.get('historical_data', [])
        days = data.get('days', 30)
        
        predictions = sales_model.predict(historical_data, days)
        
        return jsonify({
            'success': True,
            'model_version': sales_model.model_version,
            'predictions': predictions,
            'summary': {
                'total_predicted_sales': sum(p['predicted_sales'] for p in predictions),
                'total_predicted_revenue': sum(p['predicted_revenue'] for p in predictions),
                'average_confidence': round(np.mean([p['confidence'] for p in predictions]), 2)
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/predict/inventory', methods=['POST'])
def predict_inventory():
    """Generate inventory reorder recommendations."""
    try:
        data = request.json or {}
        
        result = inventory_model.recommend_reorder(
            current_stock=data.get('current_stock', 0),
            avg_daily_sales=data.get('avg_daily_sales', 10),
            lead_time_days=data.get('lead_time_days', 7),
            safety_stock_days=data.get('safety_stock_days', 3)
        )
        
        return jsonify({
            'success': True,
            'model_version': inventory_model.model_version,
            'recommendation': result
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/predict/batch', methods=['POST'])
def batch_predict():
    """Batch prediction for multiple products."""
    try:
        data = request.json or {}
        products = data.get('products', [])
        
        results = []
        for product in products:
            inventory_rec = inventory_model.recommend_reorder(
                current_stock=product.get('current_stock', 0),
                avg_daily_sales=product.get('avg_daily_sales', 10)
            )
            
            results.append({
                'product_id': product.get('id'),
                'product_name': product.get('name'),
                'recommendation': inventory_rec
            })
        
        return jsonify({
            'success': True,
            'results': results,
            'summary': {
                'total_products': len(results),
                'critical_items': len([r for r in results if r['recommendation']['urgency'] == 'critical']),
                'high_priority_items': len([r for r in results if r['recommendation']['urgency'] == 'high'])
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV', 'development') == 'development'
    app.run(host='0.0.0.0', port=port, debug=debug)
