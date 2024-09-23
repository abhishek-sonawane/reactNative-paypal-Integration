import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Button, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { capturePaymentForPurchase, getAuthToken, makePurchaseRequest } from '../api/paypalService';
import WebView from 'react-native-webview';
import queryString from 'query-string';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
// import toast from 'react-hot-toast';

const ProductDetailsScreen = ({ route, navigation }) => {
    const { itemData } = route.params;
    const [token, setToken] = useState<string>('')
    const [approvalUrl, setApprovalUrl] = useState<string | null>('')
    const [loading, setLoading] = useState<boolean>(false)
    const [hasCalledSuccess, setHasCalledSuccess] = useState<boolean>(false);


    async function handlePurchaseProduct(itemData) {
        try {
            setLoading(true)
            console.log('item data===>', itemData)
            const resToken = await getAuthToken()
            console.log('access token====>', resToken?.access_token)
            setToken(resToken?.access_token)
            if (resToken?.access_token) {
                const purchasereq = await makePurchaseRequest(resToken?.access_token, itemData)
                console.log('purchase req=====>',purchasereq)
                const apprrovalLink = purchasereq.links.find(item => item.rel == "approve")?.href
                setApprovalUrl(apprrovalLink)
                setLoading(false)
                console.log('approvalLink=====>', approvalUrl || apprrovalLink)
            }
        } catch (error) {
            setLoading(false)
            console.log('error')
        }
    }


    function handleViewChange(webView) {
        console.log("webview===>", webView)
        if (webView?.url.includes('https://example.com/cancel')) {
            setApprovalUrl(null)
            Alert.alert('payment failed', 'Your payment could not be completed')
        }
        else if (webView?.url.includes('https://example.com/success')) {
            const urls = queryString.parseUrl(webView?.url)
            console.log('urls parts ====>', urls)
            setApprovalUrl(null)
            handleSucces(urls?.query?.token)
        }
    }


    async function handleSucces(orderId) {
        if (hasCalledSuccess) {
            console.log('api called twice')
            return;
        } // Prevent multiple calls
        setHasCalledSuccess(true);
        setLoading(true)
        try {
            const resToken = await getAuthToken()
            console.log('access token====>', resToken?.access_token)
            const capture = await capturePaymentForPurchase(resToken?.access_token, orderId)
            if(capture?.status=='COMPLETED'){
                // setApprovalUrl(null)
                setLoading(false)
                Alert.alert('payment already made order is in process')
            }
            if (capture) {
                console.log("payment response===>", capture)
                setLoading(false)
                Alert.alert('Success', 'Your payment was successful!')
            } else {
                setLoading(false)
                Alert.alert('Error', 'Something went wrong finishing up the payment')
                throw new Error('something went wrong finishing the payment')
            }
        } catch (error) {
            console.log(error)
        }
    }


    // if (loading) {
    //     return (
    //         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    //             <ActivityIndicator size="large" color="blue" />
    //         </View>
    //     )
    // }

    if (approvalUrl) {
        return (
            <View style={{ flex: 1 }} >
                <WebView source={{ uri: approvalUrl }} onNavigationStateChange={(webView) => handleViewChange(webView)} />
            </View>
        )
    }

    return (
        <View style={[styles.container,{opacity:loading?0.5:1}]}>
             {
                loading&&
                <View style={{position:'absolute',zIndex:4,top: 0, bottom: 0, left: 0, right: 0, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator  style={{ transform: [{ scaleX: 2 }, { scaleY: 2 }] }} size="large" color="blue" />
            </View>
             }

             
            <Image source={{ uri: itemData.image }} style={styles.image} />
            <View style={styles.itemNameContainer} >
                <Text style={styles.name}>{itemData.brand}</Text>
                <Text style={{ fontSize: 18, marginBottom: 10 }} >{itemData.name}</Text>
            </View>
            <View style={{ 
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                gap: 30,
                alignItems: 'center'
                }} >
                <Text style={styles.price}>${itemData.price}</Text>
                <Text style={styles.rating}>{itemData.rating} rating</Text>
            </View>
            <Text style={styles.type}>{itemData.type}</Text>
            <TouchableOpacity
                // onPress={()=>handlePurchaseProduct(itemData)}
                style={[styles.button, { backgroundColor: 'black', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 8 }]}
            >
                <MaterialIcons name='shopping-cart' size={20} color='white' />
                <Text style={{ color: 'white', fontSize: 18 }} > Add to Cart</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => handlePurchaseProduct(itemData)}
                style={[styles.button, { display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 8 }]}
            >
                <MaterialIcons name='paypal' size={23} color='white' />
                <Text style={{ color: 'white', fontSize: 21, textAlign: 'center' }} >Buy Now</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        alignItems: 'flex-start',
        backgroundColor: '#fff',
    },
    itemNameContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 17
    },
    image: {
        width: '100%',
        // maxWidth:200,
        height: 200,
        marginBottom: 20,
        borderRadius: 10,
    },
    name: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    rating: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    price: {
        fontSize: 20,
        color: 'green',
        marginBottom: 10,
    },
    type: {
        fontSize: 16,
        color: '#555',
        marginBottom: 20,
    },
    button: {
        width: '100%',
        // maxWidth:'80%',
        paddingVertical: 10,
        marginTop: 21,
        alignSelf: 'center',
        // paddingHorizontal: 80,
        borderRadius: 8,
        backgroundColor: 'blue',
    }
});

export default ProductDetailsScreen;
